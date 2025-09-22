import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { SupabaseAuthService } from '../../core/auth/supabase-auth.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private supabaseAuth: SupabaseAuthService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const authResult = await this.supabaseAuth.login(loginDto.email, loginDto.password);
    
    // Verifica se o usuário existe no banco local, se não, cria
    let user = await this.prisma.appUser.findUnique({
      where: { authUserId: authResult.user_id },
    });

    if (!user) {
      // Cria o usuário no banco local se não existir
      user = await this.prisma.appUser.create({
        data: {
          authUserId: authResult.user_id,
          email: authResult.email,
          fullName: authResult.email.split('@')[0], // Nome padrão baseado no email
        },
      });
    }

    return authResult;
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    // Verifica se o email já existe
    const existingUser = await this.prisma.appUser.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Verifica se o CNPJ já existe (se fornecido)
    if (registerDto.companyCnpj) {
      const existingCompany = await this.prisma.company.findUnique({
        where: { cnpj: registerDto.companyCnpj },
      });

      if (existingCompany) {
        throw new ConflictException('CNPJ já está em uso');
      }
    }

    // Registra o usuário no Supabase
    const authResult = await this.supabaseAuth.register(
      registerDto.email,
      registerDto.password,
    );

    // Cria o usuário e a empresa em uma transação
    const result = await this.prisma.$transaction(async (tx) => {
      // Cria o usuário no banco local
      const user = await tx.appUser.create({
        data: {
          authUserId: authResult.user_id,
          email: registerDto.email,
          fullName: registerDto.fullName,
        },
      });

      // Cria a empresa
      const company = await tx.company.create({
        data: {
          name: registerDto.companyName,
          cnpj: registerDto.companyCnpj,
          phone: registerDto.companyPhone,
          address: registerDto.companyAddress,
          createdById: user.id,
        },
      });

      // Cria a associação do usuário com a empresa como owner
      await tx.companyMember.create({
        data: {
          companyId: company.id,
          userId: user.id,
          role: 'owner',
        },
      });

      return { user, company };
    });

    return {
      ...authResult,
      company_id: result.company.id,
    };
  }

  async me(authUserId: string) {
    const user = await this.prisma.appUser.findUnique({
      where: { authUserId },
      include: {
        memberships: {
          include: { company: true },
        },
      },
    });
    // pode acontecer do back ainda não ter espelhado o user; trate como preferir
    return user;
  }
}
