export declare class CompanyDto {
    name: string;
    cnpj?: string;
    phone?: string;
    address?: string;
    logoPath?: string;
    letterheadPath?: string;
}
export declare class RegisterDto {
    fullName?: string;
    email: string;
    password: string;
    company: CompanyDto;
}
