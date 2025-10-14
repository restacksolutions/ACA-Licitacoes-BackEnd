import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../utils/prisma.service';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: { sub: string; email: string };
  companyId?: string;
  membership?: { role: string; [key: string]: any };
}

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();

    // Tenta pegar o companyId do header primeiro, depois da URL, depois do body
    let companyId = req.headers['x-company-id'] as string;
    if (!companyId || typeof companyId !== 'string') {
      // Se não tem no header, tenta pegar da URL (para rotas como /companies/:id/members)
      companyId = req.params?.companyId;
    }
    if (!companyId || typeof companyId !== 'string') {
      // Se não tem na URL, tenta pegar do body (para rotas como /company-docs)
      const body = req.body as Record<string, unknown> | undefined;
      const bodyCompanyId =
        (typeof body?.company_id === 'string' && body.company_id) ||
        (typeof body?.companyId === 'string' && body.companyId);
      if (bodyCompanyId) {
        companyId = bodyCompanyId;
      }
    }
    if (!companyId || typeof companyId !== 'string') {
      const contentType = req.headers['content-type'] as string;
      if (contentType && contentType.includes('multipart/form-data')) {
        // Para multipart, o body pode não estar parseado ainda
        // Faz uma checagem de tipo mais segura nos campos do form se disponível
        const formBody = req.body as Record<string, unknown> | undefined;
        const multipartCompanyId =
          (typeof formBody?.company_id === 'string' && formBody.company_id) ||
          (typeof formBody?.companyId === 'string' && formBody.companyId);
        if (multipartCompanyId) {
          companyId = multipartCompanyId;
        }
      }
    }

    if (!companyId || typeof companyId !== 'string') {
      throw new ForbiddenException(
        'Company ID required (X-Company-Id header, companyId param, or company_id in body)',
      );
    }

    const userId = req.user?.sub;
    if (!userId) throw new ForbiddenException('No user');

    const membership = await this.prisma.companyMember.findFirst({
      where: { companyId, userId },
    });
    if (!membership)
      throw new ForbiddenException('No membership for this company');

    req.companyId = companyId;
    req.membership = membership; // { role, ... }
    return true;
  }
}
