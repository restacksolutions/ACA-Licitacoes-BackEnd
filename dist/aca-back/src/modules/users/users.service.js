"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async me(authUserId) {
        console.log('🔍 Buscando usuário:', authUserId);
        try {
            const user = await this.prisma.appUser.findUnique({
                where: { authUserId },
                include: {
                    memberships: {
                        include: {
                            company: true
                        }
                    },
                    companies: true,
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
            if (!user)
                throw new common_1.NotFoundException('Usuário não encontrado');
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
            const result = {
                id: user.id,
                authUserId: user.authUserId,
                fullName: user.fullName,
                email: user.email,
                createdAt: user.createdAt.toISOString(),
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
                stats: {
                    totalMemberships,
                    totalOwnedCompanies,
                    totalEvents,
                    activeMemberships: user.memberships.filter(m => m.company.active).length,
                    activeOwnedCompanies: user.companies.filter(c => c.active).length,
                    recentEvents: user.events.length
                },
                permissions: {
                    canCreateCompanies: true,
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
        }
        catch (error) {
            console.error('❌ Erro na consulta:', error);
            throw error;
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map