import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
export declare class CompaniesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCompanyDto, createdById: string): import(".prisma/client").Prisma.Prisma__CompanyClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getById(companyId: string): Promise<{
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
    update(companyId: string, dto: UpdateCompanyDto): import(".prisma/client").Prisma.Prisma__CompanyClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    myCompanies(authUserId: string): Promise<{
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
}
