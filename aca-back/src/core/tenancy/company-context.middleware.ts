import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyContextMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Pular middleware para rotas públicas
    if (this.isPublicRoute(req.path)) {
      return next();
    }

    // Verificar se o usuário está autenticado
    // Se req.user não existe, significa que o guard JWT ainda não processou ou falhou
    const user = (req as any).user;
    if (!user || !user.authUserId) {
      // Se não há usuário autenticado, deixar o guard JWT lidar com isso
      return next();
    }

    try {
      // Buscar usuário e suas empresas
      const appUser = await this.prisma.appUser.findUnique({
        where: { authUserId: user.authUserId },
        include: {
          memberships: {
            include: { company: true },
          },
        },
      });

      if (!appUser) {
        throw new ForbiddenException('Usuário não encontrado');
      }

      if (!appUser.memberships || appUser.memberships.length === 0) {
        throw new ForbiddenException('Usuário não possui empresa ativa');
      }

      // Adicionar contexto da empresa ao request
      (req as any).companyContext = {
        userId: appUser.id,
        authUserId: user.authUserId,
        companies: appUser.memberships.map(m => ({
          id: m.company.id,
          name: m.company.name,
          role: m.role,
        })),
        activeCompany: appUser.memberships[0].company,
        activeMembership: appUser.memberships[0],
      };

      // Validar se a empresa solicitada pertence ao usuário
      const companyId = this.extractCompanyId(req);
      if (companyId) {
        const hasAccess = appUser.memberships.some(m => m.company.id === companyId);
        if (!hasAccess) {
          throw new ForbiddenException('Acesso negado à empresa solicitada');
        }
      }

      next();
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Erro ao validar contexto da empresa');
    }
  }

  private isPublicRoute(path: string): boolean {
    const publicRoutes = [
      '/health',
      '/api/health',
      '/v1/auth/login',
      '/v1/auth/register',
      '/v1/auth/refresh',
      '/docs',
      '/api/docs',
    ];

    return publicRoutes.some(route => path.startsWith(route));
  }

  private extractCompanyId(req: Request): string | null {
    // Tentar extrair company_id de diferentes lugares
    const params = (req as any).params;
    const query = (req as any).query;
    const body = (req as any).body;

    return params?.companyId || query?.company_id || body?.company_id || null;
  }
}
