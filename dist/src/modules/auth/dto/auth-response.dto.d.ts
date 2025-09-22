export declare class UserResponseDto {
    id: string;
    fullName?: string;
    email: string;
    createdAt: string;
}
export declare class CompanyResponseDto {
    id: string;
    name: string;
    cnpj?: string;
    active: boolean;
    createdAt: string;
}
export declare class MembershipResponseDto {
    id: string;
    role: string;
}
export declare class AuthResponseDto {
    access_token: string;
    access_expires_at: string;
    refresh_token: string;
    refresh_expires_at: string;
    user: UserResponseDto;
    company: CompanyResponseDto;
    membership: MembershipResponseDto;
}
