import { PrismaService } from '../../core/prisma/prisma.service';
export declare class MembersService {
    private prisma;
    constructor(prisma: PrismaService);
    list(companyId: string): Promise<({
        user: {
            email: string | null;
            fullName: string | null;
            id: string;
            authUserId: string;
            createdAt: Date;
        };
    } & {
        id: string;
        role: import(".prisma/client").$Enums.RoleCompany;
        companyId: string;
        userId: string;
    })[]>;
    invite(companyId: string, email: string, role: 'owner' | 'admin' | 'member'): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.RoleCompany;
        companyId: string;
        userId: string;
    }>;
    updateRole(memberId: string, role: 'owner' | 'admin' | 'member'): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.RoleCompany;
        companyId: string;
        userId: string;
    }>;
    remove(memberId: string): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.RoleCompany;
        companyId: string;
        userId: string;
    }>;
}
