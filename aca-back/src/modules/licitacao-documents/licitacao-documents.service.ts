import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateLicitacaoDocumentDto, UpdateLicitacaoDocumentDto, UploadLicitacaoDocumentDto } from './dto/licitacao-document.dto';
import { LicitacaoDocType, Prisma } from '@prisma/client';

@Injectable()
export class LicitacaoDocumentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(licitacaoId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [documents, total] = await Promise.all([
      this.prisma.licitacaoDocument.findMany({
        where: { licitacaoId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.licitacaoDocument.count({ where: { licitacaoId } })
    ]);

    return {
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(licitacaoId: string, docId: string) {
    const document = await this.prisma.licitacaoDocument.findFirst({
      where: { id: docId, licitacaoId }
    });

    if (!document) {
      throw new NotFoundException('Documento não encontrado');
    }

    return document;
  }

  async create(licitacaoId: string, dto: CreateLicitacaoDocumentDto) {
    return this.prisma.licitacaoDocument.create({
      data: {
        licitacaoId,
        name: dto.docType,
        type: dto.docType,
        docType: dto.docType as LicitacaoDocType,
        required: dto.required,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        notes: dto.notes,
      }
    });
  }

  async upload(licitacaoId: string, dto: UploadLicitacaoDocumentDto, file: Express.Multer.File) {
    // Simular upload - em produção, usar Supabase Storage
    const filePath = `licitacoes/${licitacaoId}/${file.originalname}`;
    
    return this.prisma.licitacaoDocument.create({
      data: {
        licitacaoId,
        name: dto.docType,
        type: dto.docType,
        docType: dto.docType as LicitacaoDocType,
        required: dto.required,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        filePath,
        notes: dto.notes
      }
    });
  }

  async getDocumentContent(licitacaoId: string, docId: string) {
    const document = await this.findOne(licitacaoId, docId);
    
    if (!document.filePath) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    // Em produção, retornar URL assinada do Supabase Storage
    return {
      filePath: document.filePath,
      downloadUrl: `https://storage.example.com/${document.filePath}`,
      fileName: document.filePath.split('/').pop()
    };
  }

  async getDocumentMeta(licitacaoId: string, docId: string) {
    return this.findOne(licitacaoId, docId);
  }

  async updateDocument(licitacaoId: string, docId: string, dto: UpdateLicitacaoDocumentDto) {
    const document = await this.findOne(licitacaoId, docId);
    
    return this.prisma.licitacaoDocument.update({
      where: { id: docId },
      data: {
        ...dto,
        docType: dto.docType as LicitacaoDocType,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined
      }
    });
  }

  async deleteDocument(licitacaoId: string, docId: string) {
    const document = await this.findOne(licitacaoId, docId);
    
    // Em produção, deletar arquivo do Supabase Storage também
    if (document.filePath) {
      console.log(`Deletando arquivo: ${document.filePath}`);
    }
    
    return this.prisma.licitacaoDocument.delete({
      where: { id: docId }
    });
  }

  async reuploadDocument(companyId: string, licitacaoId: string, docId: string, dto: UploadLicitacaoDocumentDto, file: Express.Multer.File) {
    const document = await this.findOne(licitacaoId, docId);
    
    // Deletar arquivo antigo se existir
    if (document.filePath) {
      console.log(`Deletando arquivo antigo: ${document.filePath}`);
    }
    
    // Upload do novo arquivo
    const newFilePath = `licitacoes/${licitacaoId}/${file.originalname}`;
    
    return this.prisma.licitacaoDocument.update({
      where: { id: docId },
      data: {
        docType: dto.docType as LicitacaoDocType,
        required: dto.required,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        filePath: newFilePath,
        notes: dto.notes,
        version: document.version + 1
      }
    });
  }
}