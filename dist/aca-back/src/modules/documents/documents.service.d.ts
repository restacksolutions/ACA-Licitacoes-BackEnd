import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateCompanyDocDto } from './dto/doc.dto';
import { SupabaseStorage } from '../../adapters/storage/supabase.storage';
export declare class DocumentsService {
    private prisma;
    private storage;
    constructor(prisma: PrismaService, storage: SupabaseStorage);
    list(companyId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        companyId: string;
        notes: string | null;
        updatedAt: Date;
        docType: string;
        docNumber: string | null;
        issuer: string | null;
        issueDate: Date | null;
        expiresAt: Date | null;
        filePath: string | null;
        version: number;
    }[]>;
    create(companyId: string, dto: CreateCompanyDocDto): import(".prisma/client").Prisma.Prisma__CompanyDocumentClient<{
        id: string;
        createdAt: Date;
        companyId: string;
        notes: string | null;
        updatedAt: Date;
        docType: string;
        docNumber: string | null;
        issuer: string | null;
        issueDate: Date | null;
        expiresAt: Date | null;
        filePath: string | null;
        version: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    upload(companyId: string, docId: string, buffer: Buffer, mime?: string): Promise<{
        id: string;
        createdAt: Date;
        companyId: string;
        notes: string | null;
        updatedAt: Date;
        docType: string;
        docNumber: string | null;
        issuer: string | null;
        issueDate: Date | null;
        expiresAt: Date | null;
        filePath: string | null;
        version: number;
    }>;
}
