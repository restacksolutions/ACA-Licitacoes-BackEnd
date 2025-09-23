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
      cors: {
        enabled: true,
        allowedOrigins: [
          'http://localhost:4200',
          'http://localhost:3001',
          'http://127.0.0.1:4200',
          'http://127.0.0.1:3001'
        ]
      }
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
      
      return {
        status: 'ok',
        database: 'connected',
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

  @Get('cors')
  @Public()
  @ApiOperation({ summary: 'Teste de CORS' })
  @ApiResponse({ status: 200, description: 'CORS funcionando' })
  async getCorsTest() {
    return {
      status: 'ok',
      cors: {
        enabled: true,
        allowedOrigins: [
          'http://localhost:4200',
          'http://localhost:3001',
          'http://127.0.0.1:4200',
          'http://127.0.0.1:3001'
        ],
        allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
          'Content-Type',
          'Authorization',
          'X-Requested-With',
          'Accept',
          'Origin'
        ],
        credentials: true
      },
      timestamp: new Date().toISOString(),
    };
  }
}
