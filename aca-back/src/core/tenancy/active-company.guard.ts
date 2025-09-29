import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActiveCompanyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      console.log(`[ActiveCompanyGuard] Iniciando verificação de empresa ativa`);
      
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      console.log(`[ActiveCompanyGuard] Usuário:`, { id: user?.id, authUserId: user?.authUserId });

      if (!user || !user.authUserId) {
        console.log(`[ActiveCompanyGuard] Usuário não autenticado`);
        throw new ForbiddenException('Usuário não autenticado');
      }

      // Verificar se o usuário tem pelo menos uma empresa
      console.log(`[ActiveCompanyGuard] Buscando membership para usuário: ${user.id}`);
      const membership = await this.prisma.companyMember.findFirst({
        where: { userId: user.id },
        include: { company: true },
      });

      console.log(`[ActiveCompanyGuard] Membership encontrado:`, { 
        id: membership?.id, 
        companyId: membership?.companyId,
        companyName: membership?.company?.name 
      });

      if (!membership) {
        console.log(`[ActiveCompanyGuard] Usuário não possui empresa ativa`);
        throw new ForbiddenException('Usuário não possui empresa ativa');
      }

      // Adicionar a empresa ativa ao request para uso posterior
      request.activeCompany = membership.company;
      request.activeMembership = membership;
      request.membership = membership; // Adicionar para o RolesGuard

      console.log(`[ActiveCompanyGuard] Empresa ativa definida:`, { 
        id: membership.company.id, 
        name: membership.company.name 
      });

      return true;
    } catch (error) {
      console.error(`[ActiveCompanyGuard] Erro ao verificar empresa ativa:`, error);
      throw error;
    }
  }
}
