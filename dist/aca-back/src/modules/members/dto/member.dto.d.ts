export declare class InviteMemberDto {
    email: string;
    role: 'owner' | 'admin' | 'member';
}
export declare class UpdateMemberRoleDto {
    role: 'owner' | 'admin' | 'member';
}
export declare class MemberResponseDto {
    id: string;
    role: 'owner' | 'admin' | 'member';
    userId: string;
    userFullName: string;
    userEmail: string;
    createdAt: string;
}
