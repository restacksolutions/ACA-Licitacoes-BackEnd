import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  
  async me(authUserId: string) {
    console.log('🔍 Buscando usuário:', authUserId);
    
    try {
      // Busca o usuário com relacionamentos necessários
      const user = await this.prisma.appUser.findUnique({
        where: { authUserId },
        include: {
          memberships: {
            include: {
              company: true
            }
          }
        },
      });
      
      console.log('👤 Usuário encontrado:', user ? 'Sim' : 'Não');
      if (user) {
        console.log('📊 Dados do usuário:', {
          id: user.id,
          email: user.email,
          fullName: user.fullName
        });
      }
      
      if (!user) throw new NotFoundException('Usuário não encontrado');
      
      // Busca estatísticas adicionais
      const [totalMemberships, totalOwnedCompanies, totalEvents] = await Promise.all([
        this.prisma.companyMember.count({
          where: { userId: user.id }
        }),
        this.prisma.company.count({
          where: { createdById: user.id }
        }),
        this.prisma.licitacaoEvent.count({
          where: { createdById: user.id }
        })
      ]);
      
      console.log('📈 Estatísticas:', { totalMemberships, totalOwnedCompanies, totalEvents });
      
      // Busca empresas onde o usuário é membro
      const memberships = await this.prisma.companyMember.findMany({
        where: { userId: user.id },
        include: {
          company: true
        }
      });
      
      // Busca empresas que o usuário criou
      const ownedCompanies = await this.prisma.company.findMany({
        where: { createdById: user.id }
      });
      
      // Busca eventos recentes
      const recentEvents = await this.prisma.licitacaoEvent.findMany({
        where: { createdById: user.id },
        orderBy: { eventDate: 'desc' },
        take: 15,
        select: {
          id: true,
          createdById: true,
          description: true,
          eventDate: true,
          newStatus: true,
          licitacaoId: true
        }
      });
      
      return {
        id: user.id,
        authUserId: user.authUserId || "" || '',
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        memberships: memberships.length > 0 ? memberships.map(membership => ({
          membershipId: membership.id,
          role: membership.role as any,
          joinedAt: membership.createdAt.toISOString(),
          company: {
            id: membership.company.id,
            name: membership.company.name,
            cnpj: membership.company.cnpj,
            phone: membership.company.phone,
            address: membership.company.address,
            logoPath: membership.company.logoPath,
            letterheadPath: membership.company.letterheadPath,
            active: membership.company.active,
            createdAt: membership.company.createdAt.toISOString(),
            createdBy: membership.company.createdById,
            creator: {
              id: user.id,
              fullName: user.fullName,
              email: user.email
            }
          }
        })) : [],
        ownedCompanies: ownedCompanies.length > 0 ? ownedCompanies.map(company => ({
          id: company.id,
          name: company.name,
          cnpj: company.cnpj,
          phone: company.phone,
          address: company.address,
          logoPath: company.logoPath,
          letterheadPath: company.letterheadPath,
          active: company.active,
          createdAt: company.createdAt.toISOString(),
          createdBy: company.createdById,
          creator: {
            id: user.id,
            fullName: user.fullName,
            email: user.email
          }
        })) : [],
        recentActivity: recentEvents.length > 0 ? recentEvents.map(event => ({
          id: event.id,
          eventAt: event.eventDate.toISOString(),
          description: event.description,
          newStatus: event.newStatus
        })) : [],
        stats: {
          totalMemberships,
          totalOwnedCompanies,
          totalEvents,
          activeMemberships: memberships.filter(m => m.company.active).length,
          activeOwnedCompanies: ownedCompanies.filter(c => c.active).length,
          recentEvents: recentEvents.length
        },
        permissions: {
          canCreateCompanies: memberships.length === 0, // Só pode criar se não for membro de nenhuma empresa
          canManageUsers: memberships.some(m => ['owner', 'admin'].includes(m.role)),
          canManageCompany: memberships.some(m => ['owner', 'admin'].includes(m.role)),
          canManageMembers: memberships.some(m => ['owner', 'admin'].includes(m.role)),
          canManageDocuments: memberships.some(m => ['owner', 'admin'].includes(m.role)),
          canManageBids: memberships.some(m => ['owner', 'admin', 'member'].includes(m.role))
        }
      };
    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error);
      throw error;
    }
  }
}