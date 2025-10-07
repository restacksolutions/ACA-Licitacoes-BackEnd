import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateCompanyDocDto, UpdateCompanyDocDto, UploadDocumentDto } from './dto/document.dto';
import { Prisma } from '@prisma/client';
import { SupabaseStorage } from '../../adapters/storage/supabase.storage';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private storage: SupabaseStorage
  ) {}

  async findAll(companyId: string, page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    
    const where = {
      companyId,
      ...(search && {
        OR: [
          { docNumber: { contains: search } },
          { issuer: { contains: search } },
          { notes: { contains: search } }
        ]
      })
    };

    const [documents, total] = await Promise.all([
      this.prisma.companyDocument.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.companyDocument.count({ where })
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

  async findOne(companyId: string, docId: string) {
    const document = await this.prisma.companyDocument.findFirst({
      where: { id: docId, companyId }
    });

    if (!document) {
      throw new NotFoundException('Documento não encontrado');
    }

    return document;
  }

  async create(companyId: string, dto: CreateCompanyDocDto) {
    // Formatar docType no formato {Cliente - Tipo documento}
    const clientName = 'Cliente'; // Para create, usar nome padrão
    const docTypeLabel = this.getDocTypeLabel(dto.docType);
    const formattedDocType = `${clientName} - ${docTypeLabel}`;
    
    return this.prisma.companyDocument.create({
      data: {
        name: dto.docType,
        type: dto.docType,
        docType: dto.docType as any, // Usar enum do DTO
        companyId,
        docNumber: dto.docNumber,
        issuer: dto.issuer,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        notes: dto.notes,
      }
    });
  }

  async upload(companyId: string, dto: UploadDocumentDto, file: Express.Multer.File) {
    try {
      // Formatar docType no formato {Cliente - Tipo documento}
      const clientName = dto.clientName || 'Cliente';
      const docTypeLabel = this.getDocTypeLabel(dto.docType);
      const formattedDocType = `${clientName} - ${docTypeLabel}`;
      
      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const fileExtension = file.originalname.split('.').pop() || 'pdf';
      const fileName = `${formattedDocType.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.${fileExtension}`;
      const filePath = `documents/${companyId}/${fileName}`;
      
      // Upload para Supabase Storage
      const uploadResult = await this.storage.uploadObject(
        filePath,
        file.buffer,
        file.mimetype
      );
      
      console.log(`[DocumentsService.upload] Arquivo enviado para Supabase Storage: ${uploadResult.path}`);
      
      // Salvar no banco de dados
      return this.prisma.companyDocument.create({
        data: {
          name: dto.docType,
          type: dto.docType,
          companyId,
          docType: dto.docType as any,
          docNumber: dto.docNumber,
          issuer: dto.issuer,
          issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
          filePath: uploadResult.path, // Caminho real no Supabase Storage
          notes: dto.notes
        }
      });
    } catch (error) {
      console.error('[DocumentsService.upload] Erro no upload:', error);
      throw new BadRequestException(`Erro ao fazer upload do arquivo: ${error.message}`);
    }
  }

  async getDocumentContent(companyId: string, docId: string) {
    const document = await this.findOne(companyId, docId);
    
    if (!document.filePath) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    try {
      // Baixar arquivo do Supabase Storage
      const fileBuffer = await this.storage.downloadObject(document.filePath);
      const fileName = document.filePath.split('/').pop() || 'documento.pdf';
      
      // Determinar tipo MIME baseado na extensão
      const extension = fileName.split('.').pop()?.toLowerCase();
      let mimeType = 'application/octet-stream';
      
      switch (extension) {
        case 'pdf':
          mimeType = 'application/pdf';
          break;
        case 'jpg':
        case 'jpeg':
          mimeType = 'image/jpeg';
          break;
        case 'png':
          mimeType = 'image/png';
          break;
        case 'doc':
          mimeType = 'application/msword';
          break;
        case 'docx':
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case 'xls':
          mimeType = 'application/vnd.ms-excel';
          break;
        case 'xlsx':
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
      }
      
      return {
        filePath: document.filePath,
        fileName: fileName,
        content: fileBuffer,
        mimeType: mimeType
      };
    } catch (error) {
      console.error('[DocumentsService.getDocumentContent] Erro ao baixar arquivo:', error);
      throw new NotFoundException('Erro ao baixar arquivo do storage');
    }
  }

  async getDocumentMeta(companyId: string, docId: string) {
    return this.findOne(companyId, docId);
  }

  async updateDocument(companyId: string, docId: string, dto: UpdateCompanyDocDto) {
    const document = await this.findOne(companyId, docId);
    
    // Se docType foi fornecido, formatar no formato {Cliente - Tipo documento}
    let formattedDocType = dto.docType;
    if (dto.docType) {
      const clientName = 'Cliente'; // Para update, usar nome padrão
      const docTypeLabel = this.getDocTypeLabel(dto.docType);
      formattedDocType = `${clientName} - ${docTypeLabel}`;
    }
    
    return this.prisma.companyDocument.update({
      where: { id: docId },
      data: {
        ...dto,
        docType: dto.docType as any, // Usar enum do DTO
        issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined
      }
    });
  }

  async deleteDocument(companyId: string, docId: string) {
    const document = await this.findOne(companyId, docId);
    
    // Deletar arquivo do Supabase Storage se existir
    if (document.filePath) {
      try {
        await this.storage.deleteObject(document.filePath);
        console.log(`[DocumentsService.deleteDocument] Arquivo deletado do Supabase Storage: ${document.filePath}`);
      } catch (error) {
        console.warn(`[DocumentsService.deleteDocument] Erro ao deletar arquivo do storage: ${error.message}`);
        // Continuar com a exclusão do banco mesmo se falhar no storage
      }
    }
    
    return this.prisma.companyDocument.delete({
      where: { id: docId }
    });
  }

  async reuploadDocument(companyId: string, docId: string, dto: UploadDocumentDto, file: Express.Multer.File) {
    try {
      const document = await this.findOne(companyId, docId);
      
      // Deletar arquivo antigo do Supabase Storage se existir
      if (document.filePath) {
        try {
          await this.storage.deleteObject(document.filePath);
          console.log(`[DocumentsService.reuploadDocument] Arquivo antigo deletado: ${document.filePath}`);
        } catch (error) {
          console.warn(`[DocumentsService.reuploadDocument] Erro ao deletar arquivo antigo: ${error.message}`);
        }
      }
      
      // Formatar docType no formato {Cliente - Tipo documento}
      const clientName = dto.clientName || 'Cliente';
      const docTypeLabel = this.getDocTypeLabel(dto.docType);
      const formattedDocType = `${clientName} - ${docTypeLabel}`;
      
      // Gerar nome único para o novo arquivo
      const timestamp = Date.now();
      const fileExtension = file.originalname.split('.').pop() || 'pdf';
      const fileName = `${formattedDocType.replace(/[^a-zA-Z0-9]/g, '_')}_v${document.version + 1}_${timestamp}.${fileExtension}`;
      const newFilePath = `documents/${companyId}/${fileName}`;
      
      // Upload do novo arquivo para Supabase Storage
      const uploadResult = await this.storage.uploadObject(
        newFilePath,
        file.buffer,
        file.mimetype
      );
      
      console.log(`[DocumentsService.reuploadDocument] Novo arquivo enviado para Supabase Storage: ${uploadResult.path}`);
      
      // Atualizar no banco de dados
      return this.prisma.companyDocument.update({
        where: { id: docId },
        data: {
          docType: dto.docType as any,
          docNumber: dto.docNumber,
          issuer: dto.issuer,
          issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
          filePath: uploadResult.path, // Caminho real no Supabase Storage
          notes: dto.notes,
          version: document.version + 1
        }
      });
    } catch (error) {
      console.error('[DocumentsService.reuploadDocument] Erro no reupload:', error);
      throw new BadRequestException(`Erro ao fazer reupload do arquivo: ${error.message}`);
    }
  }

  /**
   * Converte o tipo de documento para texto legível
   */
  private getDocTypeLabel(docType: string): string {
    const labels: { [key: string]: string } = {
      'cnpj': 'CNPJ',
      'certidao': 'Certidão',
      'procuracao': 'Procuração',
      'inscricao_estadual': 'Inscrição Estadual',
      'outro': 'Outros'
    };
    
    return labels[docType] || docType;
  }
}