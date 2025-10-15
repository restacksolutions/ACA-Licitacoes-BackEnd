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

@Injectable()
export class CompanyDocsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, dto: CreateCompanyDocDto) {
    // Cria metadados; o arquivo é carregado depois via /:id/upload
    const doc = await this.prisma.companyDocument.create({
      data: {
        companyId,
        clientName: dto.clientName,
        docType: dto.docType,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        notes: dto.notes ?? null,
        // placeholders até o upload
        fileName: 'pending',
        fileMime: 'application/octet-stream',
        fileSize: 0,
        fileSha256: '',
        fileData: Buffer.alloc(0),
      },
    });

    // Remove o campo fileData da resposta
    const { fileData: _, ...docWithoutFileData } = doc;
    return docWithoutFileData;
  }

  async list(
    companyId: string,
    status?: 'valid' | 'expiring' | 'expired',
    inDays?: number,
  ) {
    const now = new Date();
    const where: Record<string, unknown> = { companyId };
    if (status) {
      if (status === 'expired') {
        where.expiresAt = { lt: now };
      } else if (status === 'expiring') {
        if (!inDays) throw new BadRequestException('inDays required');
        where.expiresAt = { gte: now, lte: addDays(now, inDays) };
      } else if (status === 'valid') {
        const after = addDays(now, inDays ?? 1);
        where.OR = [{ expiresAt: null }, { expiresAt: { gt: after } }];
      }
    }
    const docs = await this.prisma.companyDocument.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Remove o campo fileData de todos os documentos
    return docs.map((doc) => {
      const { fileData: _, ...docWithoutFileData } = doc;
      return docWithoutFileData;
    });
  }

  async get(companyId: string, id: string) {
    const doc = await this.prisma.companyDocument.findFirst({
      where: { id, companyId },
    });
    if (!doc) throw new NotFoundException('Document not found');

    // Remove o campo fileData da resposta
    const { fileData: _, ...docWithoutFileData } = doc;
    return docWithoutFileData;
  }

  async update(companyId: string, id: string, dto: UpdateCompanyDocDto) {
    await this.get(companyId, id);
    const doc = await this.prisma.companyDocument.update({
      where: { id },
      data: dto,
    });

    // Remove o campo fileData da resposta
    const { fileData: _, ...docWithoutFileData } = doc;
    return docWithoutFileData;
  }

  async remove(companyId: string, id: string) {
    await this.get(companyId, id);
    const doc = await this.prisma.companyDocument.delete({ where: { id } });

    // Remove o campo fileData da resposta
    const { fileData: _, ...docWithoutFileData } = doc;
    return docWithoutFileData;
  }
}
