import { RoleCompany } from '@prisma/client';
export declare class InviteMemberDto {
    email: string;
    role?: RoleCompany;
}
export declare class UpdateMemberRoleDto {
    role: RoleCompany;
}
export declare class MemberResponseDto {
    id: string;
    role: RoleCompany;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        fullName: string;
        email: string;
    };
}
