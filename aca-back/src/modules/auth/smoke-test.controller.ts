import { Controller, Post, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../core/security/public.decorator';
import { PrismaService } from '../../core/prisma/prisma.service';

@ApiTags('Smoke Test')
@Controller('api/v1/smoke-test')
export class SmokeTestController {
  constructor(private prisma: PrismaService) {}

  @Public()
  @Post('create-user-company')
  @ApiOperation({ summary: 'Teste de criação de usuário e empresa isolada' })
  @ApiResponse({ status: 200, description: 'Usuário e empresa criados com sucesso' })
  async createUserAndCompany() {
    try {
      // Gerar dados fake
      const fakeAuthId = `fake_auth_${Date.now()}`;
      const fakeEmail = `teste+${Math.floor(Math.random() * 100000)}@exemplo.com`;
      
      // 1. Criar usuário
      const user = await this.prisma.appUser.create({
        data: {
          authUserId: fakeAuthId,
          email: fakeEmail,
          fullName: 'Usuário Teste',
        },
      });

      // 2. Criar empresa
      const company = await this.prisma.company.create({
        data: {
          name: 'Empresa Teste',
          createdById: user.id,
        },
      });

      // 3. Criar associação
      const membership = await this.prisma.companyMember.create({
        data: {
          companyId: company.id,
          userId: user.id,
          role: 'OWNER',
        },
      });

      return {
        success: true,
        message: 'Usuário e empresa criados com sucesso',
        data: {
          user: {
            id: user.id,
            authUserId: user.authUserId,
            email: user.email,
            fullName: user.fullName,
          },
          company: {
            id: company.id,
            name: company.name,
            createdById: company.createdById,
          },
          membership: {
            id: membership.id,
            companyId: membership.companyId,
            userId: membership.userId,
            role: membership.role,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Erro no smoke test: ${error.message}`,
        error: error,
      };
    }
  }

  @Public()
  @Get('check-database')
  @ApiOperation({ summary: 'Verificar conexão com banco de dados' })
  @ApiResponse({ status: 200, description: 'Conexão com banco verificada' })
  async checkDatabase() {
    try {
      // Testar conexão com banco
      const userCount = await this.prisma.appUser.count();
      const companyCount = await this.prisma.company.count();
      const membershipCount = await this.prisma.companyMember.count();

      return {
        success: true,
        message: 'Conexão com banco de dados OK',
        counts: {
          users: userCount,
          companies: companyCount,
          memberships: membershipCount,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Erro de conexão: ${error.message}`,
        error: error,
      };
    }
  }
}
