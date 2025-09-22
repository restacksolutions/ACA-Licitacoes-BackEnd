import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateCompanyDocDto } from './dto/doc.dto';
import { SupabaseStorage } from '../../adapters/storage/supabase.storage';
import { ulid } from 'ulid';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService, private storage: SupabaseStorage) {}

  list(companyId: string) {
    return this.prisma.companyDocument.findMany({ where: { companyId } });
  }

  create(companyId: string, dto: CreateCompanyDocDto) {
    return this.prisma.companyDocument.create({ data: { companyId, ...dto } });
  }

  async upload(companyId: string, docId: string, buffer: Buffer, mime?: string) {
    const doc = await this.prisma.companyDocument.findFirst({ where: { id: docId, companyId } });
    if (!doc) throw new NotFoundException('Documento não encontrado');
    const path = `companies/${companyId}/docs/${docId}/${ulid()}`;
    await this.storage.uploadObject(path, buffer, mime);
    return this.prisma.companyDocument.update({ where: { id: docId }, data: { filePath: path, updatedAt: new Date() } });
  }
}
