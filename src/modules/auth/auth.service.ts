import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../common/utils/prisma.service';
import { RegisterDto, LoginDto } from './dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AppUser, Company } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  private async issueTokens(sub: string, email: string) {
    const accessToken = await this.jwt.signAsync(
      { sub, email },
      {
        secret: process.env.JWT_ACCESS_SECRET!,
        expiresIn: process.env.JWT_ACCESS_TTL || '15m',
      },
    );
    const refreshToken = await this.jwt.signAsync(
      { sub, email, type: 'refresh' },
      {
        secret: process.env.JWT_REFRESH_SECRET!,
        expiresIn: process.env.JWT_REFRESH_TTL || '7d',
      },
    );
    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const exists: AppUser | null = await this.prisma.appUser.findUnique({
        where: { email: dto.email },
      });
      if (exists) throw new UnauthorizedException('Email already used');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const user: AppUser = await this.prisma.appUser.create({
        data: {
          email: dto.email,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          passwordHash: await argon2.hash(dto.password),
          fullName: dto.fullName ?? null,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const company: Company = await this.prisma.company.create({
        data: { name: dto.companyName, cnpj: dto.cnpj, createdById: user.id },
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await this.prisma.companyMember.create({
        data: { companyId: company.id, userId: user.id, role: 'owner' },
      });

      const tokens = await this.issueTokens(user.id, user.email);
      return {
        ...tokens,
        user_id: user.id,
        email: user.email,
        company_id: company.id
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Registration failed');
    }
  }

  async login(dto: LoginDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const user: AppUser | null = await this.prisma.appUser.findUnique({
        where: { email: dto.email },
      });
      if (!user) throw new UnauthorizedException('Invalid credentials');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const ok: boolean = await argon2.verify(user.passwordHash, dto.password);
      if (!ok) throw new UnauthorizedException('Invalid credentials');
      
      const tokens = await this.issueTokens(user.id, user.email);
      return {
        ...tokens,
        user_id: user.id,
        email: user.email
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Login failed');
    }
  }

  async refresh(userId: string, email: string) {
    try {
      return this.issueTokens(userId, email);
    } catch {
      throw new UnauthorizedException('Token refresh failed');
    }
  }
}
