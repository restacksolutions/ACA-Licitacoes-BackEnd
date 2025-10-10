import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/utils/prisma.service';
import { CreateCompanyDocDto, UpdateCompanyDocDto } from './dto';

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 3600 * 1000);
}

interface WhereClause {
  companyId: string;
  expiresAt?: {
    lt?: Date;
    gte?: Date;
    lte?: Date;
    gt?: Date;
  };
  OR?: Array<{
    expiresAt: null | { gt: Date };
  }>;
}

interface UpdateData {
  clientName?: string;
  docType?: string;
  fileName?: string;
  fileMime?: string;
  fileSize?: number;
  fileSha256?: string;
  fileData?: Buffer;
  issueDate?: Date | null;
  expiresAt?: Date | null;
  notes?: string;
  version?: number;
}

interface CreateData {
  companyId: string;
  clientName: string;
  docType: string;
  fileName: string;
  fileMime: string;
  fileSize: number;
  fileSha256: string;
  fileData: Buffer;
  issueDate: Date | null;
  expiresAt: Date | null;
  notes?: string;
}

interface CompanyDocument {
  id: string;
  companyId: string;
  clientName: string;
  docType: string;
  fileName: string;
  fileMime: string;
  fileSize: number;
  fileSha256: string;
  fileData: Buffer;
  issueDate: Date | null;
  expiresAt: Date | null;
  notes: string | null;
  version: number;
  createdAt: Date;
}

@Injectable()
export class CompanyDocsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, dto: CreateCompanyDocDto) {
    // sanidade mínima de mimetype via extensão (opcional, valida no front também)
    const allowed = ['.pdf', '.doc', '.docx'];
    if (!allowed.some((ext) => dto.fileName.toLowerCase().endsWith(ext))) {
      throw new BadRequestException('Only PDF/DOC/DOCX are allowed');
    }

    const data: CreateData = {
      companyId,
      clientName: dto.clientName,
      docType: dto.docType,
      fileName: dto.fileName,
      fileMime: dto.fileMime,
      fileSize: dto.fileSize,
      fileSha256: dto.fileSha256,
      fileData: dto.fileData,
      issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      notes: dto.notes,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return this.prisma.companyDocument.create({ data: data as any });
  }

  async list(
    companyId: string,
    status?: 'valid' | 'expiring' | 'expired',
    inDays?: number,
  ) {
    const now = new Date();
    const where: WhereClause = { companyId };

    if (status) {
      if (status === 'expired') {
        where.expiresAt = { lt: now };
      } else if (status === 'expiring') {
        if (!inDays)
          throw new BadRequestException('inDays required for expiring');
        where.expiresAt = { gte: now, lte: addDays(now, inDays) };
      } else if (status === 'valid') {
        // válido = sem expiração OU expira além da janela especificada
        const after = addDays(now, inDays ?? 1);
        where.OR = [{ expiresAt: null }, { expiresAt: { gt: after } }];
      }
    }

    return this.prisma.companyDocument.findMany({
      where: where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(companyId: string, id: string) {
    const doc = await this.prisma.companyDocument.findFirst({
      where: { id, companyId },
    });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async update(companyId: string, id: string, dto: UpdateCompanyDocDto) {
    const doc = await this.get(companyId, id);

    // versão simples: se trocar fileName e não vier version, incremente
    const patch: UpdateData = {
      clientName: dto.clientName,
      docType: dto.docType,
      fileName: dto.fileName,
      fileMime: dto.fileMime,
      fileSize: dto.fileSize,
      fileSha256: dto.fileSha256,
      fileData: dto.fileData,
      notes: dto.notes,
      version: dto.version,
    };

    // Usar type assertion mais segura
    const docWithFileName = doc as unknown as CompanyDocument;
    if (
      dto.fileName &&
      dto.fileName !== docWithFileName.fileName &&
      !('version' in dto)
    ) {
      patch.version = (doc.version ?? 1) + 1;
    }

    // Converter datas se fornecidas
    if (dto.issueDate) {
      patch.issueDate = new Date(dto.issueDate);
    }
    if (dto.expiresAt) {
      patch.expiresAt = new Date(dto.expiresAt);
    }

    return this.prisma.companyDocument.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: patch as any,
    });
  }

  async remove(companyId: string, id: string) {
    await this.get(companyId, id);
    return this.prisma.companyDocument.delete({ where: { id } });
  }
}
