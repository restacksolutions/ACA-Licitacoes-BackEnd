export declare class CreateCompanyDocDto {
    docType: string;
    docNumber?: string;
    issuer?: string;
    issueDate?: string;
    expiresAt?: string;
    notes?: string;
}
export declare class UpdateCompanyDocDto {
    docType?: string;
    docNumber?: string;
    issuer?: string;
    issueDate?: string;
    expiresAt?: string;
    notes?: string;
}
export declare class CompanyDocResponseDto {
    id: string;
    docType: string;
    docNumber?: string;
    issuer?: string;
    issueDate?: string;
    expiresAt?: string;
    filePath?: string;
    notes?: string;
    version: number;
    createdAt: string;
    updatedAt: string;
}
