import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/utils/prisma.service';
import {
  CreateLicitacaoDto,
  UpdateLicitacaoDto,
  CreateLicDocDto,
  UpdateLicDocDto,
  CreateLicEventDto,
} from './dto';

@Injectable()
export class LicitacoesService {
  constructor(private prisma: PrismaService) {}

  // LICITAÇÕES
  create(companyId: string, dto: CreateLicitacaoDto) {
    return this.prisma.licitacao.create({ data: { ...dto, companyId } });
  }

  list(companyId: string, status?: string, search?: string) {
    return this.prisma.licitacao.findMany({
      where: {
        companyId,
        ...(status && {
          status: status as
            | 'draft'
            | 'open'
            | 'closed'
            | 'cancelled'
            | 'awarded',
        }),
        title: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(companyId: string, id: string) {
    const item = await this.prisma.licitacao.findFirst({
      where: { id, companyId },
    });
    if (!item) throw new NotFoundException('Licitacao not found');
    return item;
  }

  async update(companyId: string, id: string, dto: UpdateLicitacaoDto) {
    await this.get(companyId, id);
    return this.prisma.licitacao.update({ where: { id }, data: dto });
  }

  async remove(companyId: string, id: string) {
    await this.get(companyId, id);
    return this.prisma.licitacao.delete({ where: { id } });
  }

  // DOCUMENTOS DA LICITAÇÃO (metadados)
  listDocs(licitacaoId: string) {
    return this.prisma.licitacaoDocument.findMany({
      where: { licitacaoId },
      orderBy: { id: 'asc' },
    });
  }

  addDoc(licitacaoId: string, dto: CreateLicDocDto) {
    return this.prisma.licitacaoDocument.create({
      data: { ...dto, licitacaoId },
    });
  }

  async updateDoc(licitacaoId: string, docId: string, dto: UpdateLicDocDto) {
    const doc = await this.prisma.licitacaoDocument.findFirst({
      where: { id: docId, licitacaoId },
    });
    if (!doc) throw new NotFoundException('Doc not found');
    return this.prisma.licitacaoDocument.update({
      where: { id: docId },
      data: dto,
    });
  }

  async removeDoc(licitacaoId: string, docId: string) {
    const doc = await this.prisma.licitacaoDocument.findFirst({
      where: { id: docId, licitacaoId },
    });
    if (!doc) throw new NotFoundException('Doc not found');
    return this.prisma.licitacaoDocument.delete({ where: { id: docId } });
  }

  // EVENTOS
  listEvents(licitacaoId: string) {
    return this.prisma.licitacaoEvent.findMany({
      where: { licitacaoId },
      orderBy: { createdAt: 'desc' },
    });
  }

  addEvent(licitacaoId: string, dto: CreateLicEventDto, createdById: string) {
    return this.prisma.licitacaoEvent.create({
      data: { ...dto, licitacaoId, createdById },
    });
  }

  // SUMMARY
  async summary(companyId: string, licitacaoId: string) {
    await this.get(companyId, licitacaoId);
    const docs = await this.prisma.licitacaoDocument.findMany({
      where: { licitacaoId },
    });
    const total = docs.length || 1;
    const required = docs.filter((d) => d.required !== false).length;
    const submitted = docs.filter((d) => d.submitted).length;
    const signed = docs.filter((d) => d.signed).length;
    const coveragePercent = Math.round((submitted / total) * 100);
    return { total, required, submitted, signed, coveragePercent };
  }
}
