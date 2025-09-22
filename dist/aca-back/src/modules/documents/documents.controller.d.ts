import { CreateCompanyDocDto } from './dto/doc.dto';
import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private readonly svc;
    constructor(svc: DocumentsService);
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
    upload(companyId: string, docId: string, file: Express.Multer.File): Promise<{
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
