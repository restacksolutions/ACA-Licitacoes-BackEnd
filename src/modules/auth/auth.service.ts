import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../core/prisma/prisma.service';
import { ArgonAdapter } from '../../adapters/hashing/argon.adapter';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthResponseDto, UserResponseDto, CompanyResponseDto, MembershipResponseDto } from './dto/auth-response.dto';
import { SignJWT, jwtVerify } from 'jose';
import { RoleCompany } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private argon: ArgonAdapter,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { fullName, email, password, company } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.appUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const passwordHash = await this.argon.hash(password);

    // Create user, company and membership in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.appUser.create({
        data: {
          fullName,
          email,
          passwordHash,
        },
      });

      // Create company
      const companyData = await tx.company.create({
        data: {
          name: company.name,
          cnpj: company.cnpj,
          phone: company.phone,
          address: company.address,
          logoPath: company.logoPath,
          letterheadPath: company.letterheadPath,
          createdById: user.id,
        },
      });

      // Create membership (user as owner)
      const membership = await tx.companyMember.create({
        data: {
          companyId: companyData.id,
          userId: user.id,
          role: RoleCompany.owner,
        },
      });

      return { user, company: companyData, membership };
    });

    // Generate tokens
    const tokens = await this.generateTokens(result.user.id, result.user.email);

    return {
      ...tokens,
      user: {
        id: result.user.id,
        fullName: result.user.fullName,
        email: result.user.email,
        createdAt: result.user.createdAt.toISOString(),
      },
      company: {
        id: result.company.id,
        name: result.company.name,
        cnpj: result.company.cnpj,
        active: result.company.active,
        createdAt: result.company.createdAt.toISOString(),
      },
      membership: {
        id: result.membership.id,
        role: result.membership.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.appUser.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await this.argon.verify(user.passwordHash, password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get user's company (assuming one company per user)
    const membership = await this.prisma.companyMember.findFirst({
      where: { userId: user.id },
      include: { company: true },
    });

    if (!membership) {
      throw new UnauthorizedException('User has no company membership');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      ...tokens,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      },
      company: {
        id: membership.company.id,
        name: membership.company.name,
        cnpj: membership.company.cnpj,
        active: membership.company.active,
        createdAt: membership.company.createdAt.toISOString(),
      },
      membership: {
        id: membership.id,
        role: membership.role,
      },
    };
  }

  async refresh(refreshDto: RefreshDto): Promise<AuthResponseDto> {
    const { refresh_token } = refreshDto;

    try {
      // Verify refresh token
      const secret = new TextEncoder().encode(
        this.configService.get<string>('JWT_REFRESH_SECRET')
      );

      const { payload } = await jwtVerify(refresh_token, secret, {
        algorithms: ['HS256'],
      });

      // Find user
      const user = await this.prisma.appUser.findUnique({
        where: { id: payload.sub as string },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Get user's company
      const membership = await this.prisma.companyMember.findFirst({
        where: { userId: user.id },
        include: { company: true },
      });

      if (!membership) {
        throw new UnauthorizedException('User has no company membership');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user.id, user.email);

      return {
        ...tokens,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
        },
        company: {
          id: membership.company.id,
          name: membership.company.name,
          cnpj: membership.company.cnpj,
          active: membership.company.active,
          createdAt: membership.company.createdAt.toISOString(),
        },
        membership: {
          id: membership.id,
          role: membership.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async me(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.appUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }

  private async generateTokens(userId: string, email: string) {
    const accessSecret = new TextEncoder().encode(
      this.configService.get<string>('JWT_ACCESS_SECRET')
    );
    const refreshSecret = new TextEncoder().encode(
      this.configService.get<string>('JWT_REFRESH_SECRET')
    );

    const now = Math.floor(Date.now() / 1000);
    const accessExpiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES');
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES');

    // Generate access token
    const accessToken = await new SignJWT({ sub: userId, email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(accessExpiresIn)
      .sign(accessSecret);

    // Generate refresh token
    const refreshToken = await new SignJWT({ sub: userId, email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(refreshExpiresIn)
      .sign(refreshSecret);

    // Calculate expiration times
    const accessExpiresAt = new Date(now + this.parseExpirationTime(accessExpiresIn)).toISOString();
    const refreshExpiresAt = new Date(now + this.parseExpirationTime(refreshExpiresIn)).toISOString();

    return {
      access_token: accessToken,
      access_expires_at: accessExpiresAt,
      refresh_token: refreshToken,
      refresh_expires_at: refreshExpiresAt,
    };
  }

  private parseExpirationTime(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));

    switch (unit) {
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 60 * 60 * 24;
      default: return value;
    }
  }
}
