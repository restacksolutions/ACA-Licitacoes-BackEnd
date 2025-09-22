import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    me(user: any): Promise<{
        memberships: ({
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
        })[];
        email: string;
        fullName: string;
        id: string;
        createdAt: Date;
    }>;
}
