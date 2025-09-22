import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  
  async me(authUserId: string) {
    console.log('🔍 Buscando usuário:', authUserId);
    
    try {
      // Busca o usuário com todos os relacionamentos necessários
      const user = await this.prisma.appUser.findUnique({
        where: { authUserId },
        include: {
          // Empresas onde o usuário é membro (company_members)
          memberships: {
            include: {
              company: true
            }
          },
          // Empresas que o usuário criou (companies)
          companies: true,
          // Eventos recentes do usuário
          events: {
            include: {
              licitacao: {
                include: {
                  company: true
                }
              }
            },
            orderBy: {
              eventAt: 'desc'
            },
            take: 15
          }
        },
      });
      
      console.log('👤 Usuário encontrado:', user ? 'Sim' : 'Não');
      if (user) {
        console.log('📊 Dados do usuário:', {
          id: user.id,
          memberships: user.memberships?.length || 0,
          companies: user.companies?.length || 0,
          events: user.events?.length || 0
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
      
      // Organiza os dados de forma estruturada e completa
      const result = {
        // Dados básicos do usuário
        id: user.id,
        authUserId: user.authUserId,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        
        // Empresas onde é membro (company_members + companies)
        memberships: user.memberships.length > 0 ? user.memberships.map(membership => ({
          membershipId: membership.id,
          role: membership.role,
          joinedAt: membership.company.createdAt.toISOString(),
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
            createdBy: membership.company.createdById
          }
        })) : null,
        
        // Empresas que criou (companies)
        ownedCompanies: user.companies.length > 0 ? user.companies.map(company => ({
          id: company.id,
          name: company.name,
          cnpj: company.cnpj,
          phone: company.phone,
          address: company.address,
          logoPath: company.logoPath,
          letterheadPath: company.letterheadPath,
          active: company.active,
          createdAt: company.createdAt.toISOString(),
          createdBy: company.createdById
        })) : null,
        
        // Atividades recentes
        recentActivity: user.events.length > 0 ? user.events.map(event => ({
          id: event.id,
          eventAt: event.eventAt.toISOString(),
          description: event.description,
          oldStatus: event.oldStatus,
          newStatus: event.newStatus,
          licitacao: event.licitacao ? {
            id: event.licitacao.id,
            title: event.licitacao.title,
            status: event.licitacao.status,
            orgao: event.licitacao.orgao,
            modalidade: event.licitacao.modalidade,
            createdAt: event.licitacao.createdAt.toISOString(),
            company: event.licitacao.company ? {
              id: event.licitacao.company.id,
              name: event.licitacao.company.name
            } : null
          } : null
        })) : null,
        
        // Estatísticas completas
        stats: {
          totalMemberships,
          totalOwnedCompanies,
          totalEvents,
          activeMemberships: user.memberships.filter(m => m.company.active).length,
          activeOwnedCompanies: user.companies.filter(c => c.active).length,
          recentEvents: user.events.length
        },
        
        // Resumo de permissões
        permissions: {
          canCreateCompanies: true, // Todos os usuários podem criar empresas
          canManageMembers: user.memberships.some(m => ['owner', 'admin'].includes(m.role)),
          canManageDocuments: user.memberships.some(m => ['owner', 'admin'].includes(m.role)),
          canManageBids: user.memberships.some(m => ['owner', 'admin'].includes(m.role))
        }
      };
      
      console.log('✅ Resultado final:', {
        memberships: result.memberships,
        ownedCompanies: result.ownedCompanies,
        recentActivity: result.recentActivity,
        stats: result.stats
      });
      
      return result;
      
    } catch (error) {
      console.error('❌ Erro na consulta:', error);
      throw error;
    }
  }
}
