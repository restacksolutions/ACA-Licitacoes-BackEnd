export declare class UserMembershipDto {
    membershipId: string;
    role: 'owner' | 'admin' | 'member';
    joinedAt: string;
    company: {
        id: string;
        name: string;
        cnpj?: string | null;
        phone?: string | null;
        address?: string | null;
        logoPath?: string | null;
        letterheadPath?: string | null;
        active: boolean;
        createdAt: string;
        createdBy: string;
        creator?: {
            id: string;
            fullName: string | null;
            email: string | null;
        } | null;
    };
}
export declare class UserOwnedCompanyDto {
    id: string;
    name: string;
    cnpj?: string | null;
    phone?: string | null;
    address?: string | null;
    logoPath?: string | null;
    letterheadPath?: string | null;
    active: boolean;
    createdAt: string;
    createdBy: string;
}
export declare class UserRecentActivityDto {
    id: string;
    eventAt: string;
    description?: string | null;
    oldStatus?: string | null;
    newStatus?: string | null;
    licitacao?: {
        id: string;
        title: string;
        status: string;
        orgao?: string | null;
        modalidade?: string | null;
        createdAt: string;
        company?: {
            id: string;
            name: string;
        } | null;
    } | null;
}
export declare class UserStatsDto {
    totalMemberships: number;
    totalOwnedCompanies: number;
    totalEvents: number;
    activeMemberships: number;
    activeOwnedCompanies: number;
    recentEvents: number;
}
export declare class UserPermissionsDto {
    canCreateCompanies: boolean;
    canManageMembers: boolean;
    canManageDocuments: boolean;
    canManageBids: boolean;
}
export declare class UserMeResponseDto {
    id: string;
    authUserId: string;
    fullName?: string | null;
    email?: string | null;
    createdAt: string;
    memberships: UserMembershipDto[] | null;
    ownedCompanies: UserOwnedCompanyDto[] | null;
    recentActivity: UserRecentActivityDto[] | null;
    stats: UserStatsDto;
    permissions: UserPermissionsDto;
}
