import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateCompanyDocDto, UpdateCompanyDocDto, UploadDocumentDto, DocumentListQueryDto } from './dto/doc.dto';
import { createHash } from 'crypto';

@Injectable()
export class DocumentsService {
  private readonly MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

  constructor(private prisma: PrismaService) {}

  async streamToBufferAndHash(stream: NodeJS.ReadableStream, maxBytes: number) {
    const hash = createHash('sha256');
    const chunks: Buffer[] = [];
    let total = 0;

    for await (const chunk of stream) {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      total += buf.length;
      if (total > maxBytes) throw new BadRequestException('Arquivo muito grande');
      hash.update(buf);
      chunks.push(buf);
    }

    const buffer = Buffer.concat(chunks);
    const sha256Hex = hash.digest('hex');
    return { buffer, size: total, sha256Hex };
  }

  async list(companyId: string, query: DocumentListQueryDto) {
    const { docType, status, page = 1, pageSize = 10, search } = query;
    const skip = (page - 1) * pageSize;

    // Construir filtros baseados nos parâmetros
    const where: any = {
      companyId,
      ...(docType && { docType }),
    };

    // Filtro por status usando a view
    if (status) {
      const now = new Date();
      const fifteenDaysFromNow = new Date();
      fifteenDaysFromNow.setDate(now.getDate() + 15);

      switch (status) {
        case 'Válido':
          where.expiresAt = {
            gt: fifteenDaysFromNow,
          };
          break;
        case 'À vencer':
          where.expiresAt = {
            gte: now,
            lte: fifteenDaysFromNow,
          };
          break;
        case 'Expirado':
          where.expiresAt = {
            lt: now,
          };
          break;
        case 'Sem validade':
          where.expiresAt = null;
          break;
      }
    }

    // Filtro de busca por número do documento, observações, emissor ou nome do cliente
    if (search) {
      where.OR = [
        { docNumber: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
        { issuer: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [documents, total] = await Promise.all([
      this.prisma.companyDocument.findMany({
        where,
        select: {
          id: true,
          docType: true,
          clientName: true,
          docNumber: true,
          issuer: true,
          issueDate: true,
          expiresAt: true,
          filePath: true,
          mimeType: true,
          fileSize: true,
          sha256Hex: true,
          notes: true,
          version: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { expiresAt: 'desc' }, // Ordenar por data de expiração
        skip,
        take: pageSize,
      }),
      this.prisma.companyDocument.count({ where }),
    ]);

    // Calcular status para cada documento
    const documentsWithStatus = documents.map(doc => {
      let statusCalc = 'Sem validade';
      if (doc.expiresAt) {
        const now = new Date();
        const fifteenDaysFromNow = new Date();
        fifteenDaysFromNow.setDate(now.getDate() + 15);

        if (doc.expiresAt < now) {
          statusCalc = 'Expirado';
        } else if (doc.expiresAt <= fifteenDaysFromNow) {
          statusCalc = 'À vencer';
        } else {
          statusCalc = 'Válido';
        }
      }

      return {
        ...doc,
        fileSize: doc.fileSize ? doc.fileSize.toString() : null,
        status: statusCalc,
      };
    });

    return {
      documents: documentsWithStatus,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  create(companyId: string, dto: CreateCompanyDocDto) {
    return this.prisma.companyDocument.create({ 
      data: { 
        companyId, 
        docType: dto.docType,
        clientName: dto.clientName,
        docNumber: dto.docNumber,
        issuer: dto.issuer,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        notes: dto.notes,
      } 
    });
  }

  async upload(companyId: string, dto: UploadDocumentDto, file: Express.Multer.File) {
    console.log(`[DocumentsService.upload] ===== INICIANDO UPLOAD =====`);
    console.log(`[DocumentsService.upload] CompanyId: ${companyId}`);
    console.log(`[DocumentsService.upload] DTO:`, dto);
    console.log(`[DocumentsService.upload] File:`, {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    try {
      // Validar tamanho do arquivo
      if (file.size > this.MAX_FILE_SIZE) {
        console.log(`[DocumentsService.upload] Arquivo muito grande: ${file.size} bytes`);
        throw new BadRequestException('Arquivo muito grande. Máximo 20MB.');
      }

      // Validar tipo MIME
      const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedMimes.includes(file.mimetype)) {
        console.log(`[DocumentsService.upload] Tipo MIME não permitido: ${file.mimetype}`);
        throw new BadRequestException('Tipo de arquivo não permitido. Use PDF, JPEG ou PNG.');
      }

      // Calcular hash SHA-256
      console.log(`[DocumentsService.upload] Calculando hash SHA-256...`);
      const hash = createHash('sha256');
      hash.update(file.buffer);
      const sha256Hex = hash.digest('hex');
      console.log(`[DocumentsService.upload] Hash calculado: ${sha256Hex.substring(0, 10)}...`);

      // Verificar se já existe documento com mesmo hash
      console.log(`[DocumentsService.upload] Verificando documento existente...`);
      const existingDoc = await this.prisma.companyDocument.findFirst({
        where: { companyId, sha256Hex },
      });

      if (existingDoc) {
        console.log(`[DocumentsService.upload] Documento com mesmo hash já existe`);
        throw new BadRequestException('Documento com mesmo conteúdo já existe');
      }

      // Obter próxima versão
      console.log(`[DocumentsService.upload] Obtendo próxima versão...`);
      const lastVersion = await this.prisma.companyDocument.aggregate({
        where: { companyId, docType: dto.docType },
        _max: { version: true },
      });
      const version = (lastVersion._max.version ?? 0) + 1;
      console.log(`[DocumentsService.upload] Próxima versão: ${version}`);

      // Criar novo documento
      console.log(`[DocumentsService.upload] Criando documento no banco...`);
      const document = await this.prisma.companyDocument.create({
        data: {
          companyId,
          docType: dto.docType,
          clientName: dto.clientName,
          docNumber: dto.docNumber,
          issuer: dto.issuer,
          issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
          notes: dto.notes,
          version,
          fileBytes: file.buffer,
          mimeType: file.mimetype,
          fileSize: BigInt(file.size),
          sha256Hex,
        },
      });

      console.log(`[DocumentsService.upload] Documento criado com sucesso: ${document.id}`);

      // Converter BigInt para string para serialização JSON
      return {
        ...document,
        fileSize: document.fileSize ? document.fileSize.toString() : null,
      };
    } catch (error) {
      console.error(`[DocumentsService.upload] Erro no upload:`, error);
      throw error;
    }
  }

  async getDocumentContent(companyId: string, docId: string) {
    const doc = await this.prisma.companyDocument.findFirst({
      where: { id: docId, companyId },
      select: { fileBytes: true, mimeType: true, sha256Hex: true },
    });

    if (!doc?.fileBytes) {
      throw new NotFoundException('Documento não encontrado');
    }

    return {
      buffer: Buffer.from(doc.fileBytes as Buffer),
      mimeType: doc.mimeType ?? 'application/pdf',
      sha256Hex: doc.sha256Hex,
    };
  }

  async getDocumentMeta(companyId: string, docId: string) {
    const doc = await this.prisma.companyDocument.findFirst({
      where: { id: docId, companyId },
      select: {
        id: true,
        docType: true,
        docNumber: true,
        issuer: true,
        issueDate: true,
        expiresAt: true,
        filePath: true,
        mimeType: true,
        fileSize: true,
        sha256Hex: true,
        notes: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!doc) {
      throw new NotFoundException('Documento não encontrado');
    }

    // Converter BigInt para string para serialização JSON
    return {
      ...doc,
      fileSize: doc.fileSize ? doc.fileSize.toString() : null,
    };
  }

  async updateDocument(companyId: string, docId: string, dto: UpdateCompanyDocDto) {
    const doc = await this.prisma.companyDocument.findFirst({
      where: { id: docId, companyId },
    });

    if (!doc) {
      throw new NotFoundException('Documento não encontrado');
    }

    const updatedDoc = await this.prisma.companyDocument.update({
      where: { id: docId },
      data: {
        docType: dto.docType,
        docNumber: dto.docNumber,
        issuer: dto.issuer,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        notes: dto.notes,
      },
    });

    // Converter BigInt para string para serialização JSON
    return {
      ...updatedDoc,
      fileSize: updatedDoc.fileSize ? updatedDoc.fileSize.toString() : null,
    };
  }

  async deleteDocument(companyId: string, docId: string) {
    console.log(`[DocumentsService.deleteDocument] Iniciando exclusão - CompanyId: ${companyId}, DocId: ${docId}`);
    
    try {
      // Verificar se o documento existe
      const doc = await this.prisma.companyDocument.findFirst({
        where: { id: docId, companyId },
        include: { company: true }
      });

      if (!doc) {
        console.log(`[DocumentsService.deleteDocument] Documento não encontrado - DocId: ${docId}`);
        throw new NotFoundException('Documento não encontrado');
      }

      console.log(`[DocumentsService.deleteDocument] Documento encontrado:`, {
        id: doc.id,
        docType: doc.docType,
        companyId: doc.companyId,
        version: doc.version
      });
      
      // Excluir o documento usando deleteMany para evitar problemas de constraint
      const result = await this.prisma.companyDocument.deleteMany({
        where: { 
          id: docId,
          companyId: companyId 
        },
      });

      console.log(`[DocumentsService.deleteDocument] Resultado da exclusão:`, result);
      
      if (result.count === 0) {
        throw new NotFoundException('Documento não foi encontrado para exclusão');
      }

      console.log(`[DocumentsService.deleteDocument] Documento excluído com sucesso - DocId: ${docId}`);
      return { success: true, deletedCount: result.count };
    } catch (error) {
      console.error(`[DocumentsService.deleteDocument] Erro ao excluir documento - DocId: ${docId}`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Erro interno ao excluir documento: ${error.message}`);
    }
  }

  async reuploadDocument(companyId: string, docId: string, dto: UploadDocumentDto, file: Express.Multer.File) {
    // Buscar documento original
    const originalDoc = await this.prisma.companyDocument.findFirst({
      where: { id: docId, companyId },
    });

    if (!originalDoc) {
      throw new NotFoundException('Documento não encontrado');
    }

    // Validar tamanho do arquivo
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException('Arquivo muito grande. Máximo 20MB.');
    }

    // Validar tipo MIME
    const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de arquivo não permitido. Use PDF, JPEG ou PNG.');
    }

    // Calcular hash SHA-256
    const hash = createHash('sha256');
    hash.update(file.buffer);
    const sha256Hex = hash.digest('hex');

    // Obter próxima versão
    const lastVersion = await this.prisma.companyDocument.aggregate({
      where: { companyId, docType: originalDoc.docType },
      _max: { version: true },
    });
    const version = (lastVersion._max.version ?? 0) + 1;

    // Criar nova versão do documento
    const document = await this.prisma.companyDocument.create({
      data: {
        companyId,
        docType: originalDoc.docType,
        clientName: dto.clientName ?? originalDoc.clientName,
        docNumber: dto.docNumber ?? originalDoc.docNumber,
        issuer: dto.issuer ?? originalDoc.issuer,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : originalDoc.issueDate,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : originalDoc.expiresAt,
        notes: dto.notes ?? originalDoc.notes,
        version,
        fileBytes: file.buffer,
        mimeType: file.mimetype,
        fileSize: BigInt(file.size),
        sha256Hex,
      },
    });

    // Converter BigInt para string para serialização JSON
    return {
      ...document,
      fileSize: document.fileSize ? document.fileSize.toString() : null,
    };
  }
}
