import { PrismaService } from '../../core/prisma/prisma.service';
import { UpdateCompanyDto } from './dto/company.dto';
export declare class CompaniesService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        createdAt: string;
        updatedAt: string;
        name: string;
        id: string;
        cnpj: string;
        phone: string;
        address: string;
        logoPath: string;
        letterheadPath: string;
        active: boolean;
    }>;
    update(id: string, updateDto: UpdateCompanyDto, userId: string): Promise<{
        createdAt: string;
        updatedAt: string;
        name: string;
        id: string;
        cnpj: string;
        phone: string;
        address: string;
        logoPath: string;
        letterheadPath: string;
        active: boolean;
    }>;
}
