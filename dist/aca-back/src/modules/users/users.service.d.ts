import { PrismaService } from '../../core/prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    me(authUserId: string): Promise<{
        id: string;
        authUserId: string;
        fullName: string;
        email: string;
        createdAt: string;
        memberships: {
            membershipId: string;
            role: import(".prisma/client").$Enums.RoleCompany;
            joinedAt: string;
            company: {
                id: string;
                name: string;
                cnpj: string;
                phone: string;
                address: string;
                logoPath: string;
                letterheadPath: string;
                active: boolean;
                createdAt: string;
                createdBy: string;
            };
        }[];
        ownedCompanies: {
            id: string;
            name: string;
            cnpj: string;
            phone: string;
            address: string;
            logoPath: string;
            letterheadPath: string;
            active: boolean;
            createdAt: string;
            createdBy: string;
        }[];
        recentActivity: {
            id: string;
            eventAt: string;
            description: string;
            oldStatus: import(".prisma/client").$Enums.LicitacaoStatus;
            newStatus: import(".prisma/client").$Enums.LicitacaoStatus;
            licitacao: {
                id: string;
                title: string;
                status: import(".prisma/client").$Enums.LicitacaoStatus;
                orgao: string;
                modalidade: string;
                createdAt: string;
                company: {
                    id: string;
                    name: string;
                };
            };
        }[];
        stats: {
            totalMemberships: number;
            totalOwnedCompanies: number;
            totalEvents: number;
            activeMemberships: number;
            activeOwnedCompanies: number;
            recentEvents: number;
        };
        permissions: {
            canCreateCompanies: boolean;
            canManageMembers: boolean;
            canManageDocuments: boolean;
            canManageBids: boolean;
        };
    }>;
}
