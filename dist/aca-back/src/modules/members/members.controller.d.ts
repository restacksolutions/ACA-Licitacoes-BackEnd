import { InviteMemberDto } from './dto/member.dto';
import { MembersService } from './members.service';
export declare class MembersController {
    private readonly svc;
    constructor(svc: MembersService);
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
    invite(companyId: string, dto: InviteMemberDto): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.RoleCompany;
        companyId: string;
        userId: string;
    }>;
    updateRole(memberId: string, dto: InviteMemberDto): Promise<{
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
