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
    const companyId = req.headers['x-company-id'] as string;
    if (!companyId || typeof companyId !== 'string') {
      throw new ForbiddenException('X-Company-Id required');
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
