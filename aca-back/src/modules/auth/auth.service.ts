import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { SupabaseAuthService } from '../../core/auth/supabase-auth.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';

interface AuthResult {
  user_id: string;
  email: string;
  access_token: string;
  expires_at: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private supabaseAuth: SupabaseAuthService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const authResult = (await this.supabaseAuth.login(
      loginDto.email,
      loginDto.password,
    )) as AuthResult;

    // Verifica se o usuário existe no banco local, se não, cria
    let user = await this.prisma.appUser.findUnique({
      where: { authUserId: authResult.user_id },
      include: {
        memberships: {
          include: { company: true },
        },
      },
    });

    if (!user) {
      // Cria o usuário no banco local se não existir
      const email = authResult.email || '';
      const defaultName = email.includes('@') ? email.split('@')[0] : 'Usuário';

      user = await this.prisma.appUser.create({
        data: {
          authUserId: authResult.user_id,
          email: email,
          fullName: defaultName,
        },
        include: {
          memberships: {
            include: { company: true },
          },
        },
      });
    }

    // Garantir que o usuário tenha pelo menos uma empresa
    if (!user.memberships || user.memberships.length === 0) {
      // Criar empresa padrão para usuários órfãos
      await this.prisma.$transaction(async (tx) => {
        const companyName =
          user?.fullName ||
          (user?.email ? user.email.split('@')[0] : 'Usuário');

        const company = await tx.company.create({
          data: {
            name: `Empresa de ${companyName}`,
            createdById: user!.id,
          },
        });

        await tx.companyMember.create({
          data: {
            companyId: company.id,
            userId: user!.id,
            role: 'owner',
          },
        });
      });

      // Recarregar o usuário com as memberships
      user = await this.prisma.appUser.findUnique({
        where: { authUserId: authResult.user_id },
        include: {
          memberships: {
            include: { company: true },
          },
        },
      });
    }

    // Retornar a primeira empresa como ativa (no futuro pode ser selecionada pelo usuário)
    const activeCompany = user?.memberships?.[0]?.company;

    return {
      ...authResult,
      active_company_id: activeCompany?.id || '',
      active_company_name: activeCompany?.name || '',
    };
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
    const authResult = (await this.supabaseAuth.register(
      registerDto.email,
      registerDto.password,
    )) as AuthResult;

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

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Garantir que o usuário tenha pelo menos uma empresa
    if (!user.memberships || user.memberships.length === 0) {
      // Criar empresa padrão para usuários órfãos
      await this.prisma.$transaction(async (tx) => {
        const company = await tx.company.create({
          data: {
            name: `Empresa de ${user.fullName || (user.email ? user.email.split('@')[0] : 'Usuário')}`,
            createdById: user.id,
          },
        });

        await tx.companyMember.create({
          data: {
            companyId: company.id,
            userId: user.id,
            role: 'owner',
          },
        });
      });

      // Recarregar o usuário com as memberships
      return await this.prisma.appUser.findUnique({
        where: { authUserId },
        include: {
          memberships: {
            include: { company: true },
          },
        },
      });
    }

    return user;
  }
}
