import { PrismaService } from '../../core/prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        email: string;
        fullName: string;
        id: string;
        createdAt: Date;
    }>;
    findMemberships(userId: string): Promise<({
        company: {
            name: string;
            id: string;
            cnpj: string;
            active: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        role: import(".prisma/client").$Enums.RoleCompany;
        companyId: string;
        userId: string;
        updatedAt: Date;
    })[]>;
}
