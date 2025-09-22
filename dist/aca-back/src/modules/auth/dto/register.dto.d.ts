export declare class RegisterDto {
    email: string;
    password: string;
    fullName: string;
    companyName: string;
    companyCnpj?: string;
    companyPhone?: string;
    companyAddress?: string;
}
export declare class RegisterResponseDto {
    access_token: string;
    expires_at: string;
    email: string;
    user_id: string;
    company_id: string;
}
