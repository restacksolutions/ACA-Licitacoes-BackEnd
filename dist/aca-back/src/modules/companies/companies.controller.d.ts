import { CompaniesService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { UserHelper } from '../../core/security/user-helper.service';
export declare class CompaniesController {
    private readonly svc;
    private readonly userHelper;
    constructor(svc: CompaniesService, userHelper: UserHelper);
    myCompanies(user: {
        authUserId: string;
    }): Promise<{
        role: import(".prisma/client").$Enums.RoleCompany;
        company: {
            name: string;
            id: string;
            createdAt: Date;
            cnpj: string | null;
            phone: string | null;
            address: string | null;
            logoPath: string | null;
            letterheadPath: string | null;
            active: boolean;
            createdById: string;
        };
    }[]>;
    create(dto: CreateCompanyDto, user: {
        authUserId: string;
    }): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        cnpj: string | null;
        phone: string | null;
        address: string | null;
        logoPath: string | null;
        letterheadPath: string | null;
        active: boolean;
        createdById: string;
    }>;
    get(companyId: string, _ctx: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        cnpj: string | null;
        phone: string | null;
        address: string | null;
        logoPath: string | null;
        letterheadPath: string | null;
        active: boolean;
        createdById: string;
    }>;
    update(companyId: string, dto: UpdateCompanyDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        cnpj: string | null;
        phone: string | null;
        address: string | null;
        logoPath: string | null;
        letterheadPath: string | null;
        active: boolean;
        createdById: string;
    }>;
}
