import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../core/prisma/prisma.service';
import { Public } from '../core/security/public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Health check básico' })
  @ApiResponse({ status: 200, description: 'API funcionando' })
  async getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('database')
  @Public()
  @ApiOperation({ summary: 'Teste de conexão com o banco de dados' })
  @ApiResponse({ status: 200, description: 'Banco conectado com sucesso' })
  @ApiResponse({ status: 500, description: 'Erro na conexão com o banco' })
  async getDatabaseHealth() {
    try {
      // Testa a conexão executando uma query simples
      await this.prisma.$queryRaw`SELECT 1 as test`;
      
      // Verifica se as tabelas existem
      const tables = await this.prisma.$queryRaw`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      `;

      return {
        status: 'ok',
        database: 'connected',
        tables: tables,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('prisma')
  @Public()
  @ApiOperation({ summary: 'Informações do Prisma' })
  @ApiResponse({ status: 200, description: 'Informações do Prisma' })
  async getPrismaInfo() {
    try {
      // Conta registros em cada tabela
      const counts = await Promise.all([
        this.prisma.appUser.count(),
        this.prisma.company.count(),
        this.prisma.companyMember.count(),
        this.prisma.companyDocument.count(),
        this.prisma.licitacao.count(),
        this.prisma.licitacaoDocument.count(),
        this.prisma.licitacaoEvent.count(),
      ]);

      return {
        status: 'ok',
        prisma: {
          version: '6.16.2',
          database: 'SQLite',
          tables: {
            appUsers: counts[0],
            companies: counts[1],
            companyMembers: counts[2],
            companyDocuments: counts[3],
            licitacoes: counts[4],
            licitacaoDocuments: counts[5],
            licitacaoEvents: counts[6],
          },
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        prisma: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
