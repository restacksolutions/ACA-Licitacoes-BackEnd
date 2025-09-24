import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    
    console.log('[CompanyGuard] ===== VERIFICANDO COMPANY ID =====');
    console.log('[CompanyGuard] Headers:', req.headers);
    console.log('[CompanyGuard] Query:', req.query);
    console.log('[CompanyGuard] Body:', req.body);
    console.log('[CompanyGuard] Params:', req.params);
    
    const companyId = req.params?.companyId || (req.headers['x-company-id'] as string) || req.query.companyId || req.body?.companyId;
    console.log('[CompanyGuard] CompanyId extraído:', companyId);
    
    if (!companyId) {
      console.error('[CompanyGuard] ERRO: companyId ausente');
      throw new BadRequestException('companyId ausente');
    }

    const authUserId = req.user?.authUserId as string | undefined;
    if (!authUserId) throw new ForbiddenException('Usuário não autenticado');

    const user = await this.prisma.appUser.findUnique({ where: { authUserId } });
    if (!user) throw new ForbiddenException('Usuário não registrado');

    const membership = await this.prisma.companyMember.findFirst({ where: { companyId, userId: user.id } });
    if (!membership) throw new ForbiddenException('Sem vínculo com a empresa');

    req.companyId = companyId;
    req.membership = membership;
    return true;
  }
}
