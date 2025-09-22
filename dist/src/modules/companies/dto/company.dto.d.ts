export declare class UpdateCompanyDto {
    name?: string;
    cnpj?: string;
    phone?: string;
    address?: string;
    active?: boolean;
}
export declare class CompanyResponseDto {
    id: string;
    name: string;
    cnpj?: string;
    phone?: string;
    address?: string;
    logoPath?: string;
    letterheadPath?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}
