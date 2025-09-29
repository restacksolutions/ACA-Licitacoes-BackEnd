import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateLicitacaoDocDto, UploadLicitacaoDocumentDto, LicitacaoDocumentListQueryDto } from './dto/licitacao-doc.dto';
import { createHash } from 'crypto';

@Injectable()
export class LicitacaoDocumentsService {
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

  async list(licitacaoId: string, query: LicitacaoDocumentListQueryDto) {
    const { docType, page = 1, pageSize = 10 } = query;
    const skip = (page - 1) * pageSize;

    const where = {
      licitacaoId,
      ...(docType && { docType }),
    };

    const [documents, total] = await Promise.all([
      this.prisma.licitacaoDocument.findMany({
        where,
        select: {
          id: true,
          docType: true,
          issueDate: true,
          expiresAt: true,
          filePath: true,
          mimeType: true,
          fileSize: true,
          sha256Hex: true,
          notes: true,
          required: true,
          submitted: true,
          signed: true,
          generatedFromTemplate: true,
          version: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.licitacaoDocument.count({ where }),
    ]);

    // Converter BigInt para string em todos os documentos
    const documentsWithStringFileSize = documents.map(doc => ({
      ...doc,
      fileSize: doc.fileSize ? doc.fileSize.toString() : null,
    }));

    return {
      documents: documentsWithStringFileSize,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  create(licitacaoId: string, dto: CreateLicitacaoDocDto) {
    return this.prisma.licitacaoDocument.create({ data: { licitacaoId, ...dto } });
  }

  async upload(companyId: string, licitacaoId: string, dto: UploadLicitacaoDocumentDto, file: Express.Multer.File) {
    // Verificar se a licitação pertence à empresa
    const licitacao = await this.prisma.licitacao.findFirst({
      where: { id: licitacaoId, companyId },
    });
    
    if (!licitacao) {
      throw new BadRequestException('Licitação não encontrada ou não pertence à empresa');
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

    // Verificar se já existe documento com mesmo hash
    const existingDoc = await this.prisma.licitacaoDocument.findFirst({
      where: { licitacaoId, sha256Hex },
    });

    if (existingDoc) {
      throw new BadRequestException('Documento com mesmo conteúdo já existe');
    }

    // Obter próxima versão
    const lastVersion = await this.prisma.licitacaoDocument.aggregate({
      where: { licitacaoId, docType: dto.docType },
      _max: { version: true },
    });
    const version = (lastVersion._max.version ?? 0) + 1;

    // Criar novo documento
    const document = await this.prisma.licitacaoDocument.create({
      data: {
        licitacaoId,
        docType: dto.docType,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        notes: dto.notes,
        required: dto.required,
        submitted: dto.submitted,
        signed: dto.signed,
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

  async getDocumentContent(licitacaoId: string, docId: string) {
    const doc = await this.prisma.licitacaoDocument.findFirst({
      where: { id: docId, licitacaoId },
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

  async getDocumentMeta(licitacaoId: string, docId: string) {
    const doc = await this.prisma.licitacaoDocument.findFirst({
      where: { id: docId, licitacaoId },
      select: {
        id: true,
        docType: true,
        issueDate: true,
        expiresAt: true,
        filePath: true,
        mimeType: true,
        fileSize: true,
        sha256Hex: true,
        notes: true,
        required: true,
        submitted: true,
        signed: true,
        generatedFromTemplate: true,
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

  async deleteDocument(licitacaoId: string, docId: string) {
    const doc = await this.prisma.licitacaoDocument.findFirst({
      where: { id: docId, licitacaoId },
    });

    if (!doc) {
      throw new NotFoundException('Documento não encontrado');
    }

    return this.prisma.licitacaoDocument.delete({
      where: { id: docId },
    });
  }

  async reuploadDocument(companyId: string, licitacaoId: string, docId: string, dto: UploadLicitacaoDocumentDto, file: Express.Multer.File) {
    // Verificar se a licitação pertence à empresa
    const licitacao = await this.prisma.licitacao.findFirst({
      where: { id: licitacaoId, companyId },
    });
    
    if (!licitacao) {
      throw new BadRequestException('Licitação não encontrada ou não pertence à empresa');
    }

    // Buscar documento original
    const originalDoc = await this.prisma.licitacaoDocument.findFirst({
      where: { id: docId, licitacaoId },
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
    const lastVersion = await this.prisma.licitacaoDocument.aggregate({
      where: { licitacaoId, docType: originalDoc.docType },
      _max: { version: true },
    });
    const version = (lastVersion._max.version ?? 0) + 1;

    // Criar nova versão do documento
    const document = await this.prisma.licitacaoDocument.create({
      data: {
        licitacaoId,
        docType: originalDoc.docType,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : originalDoc.issueDate,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : originalDoc.expiresAt,
        notes: dto.notes ?? originalDoc.notes,
        required: dto.required ?? originalDoc.required,
        submitted: dto.submitted ?? originalDoc.submitted,
        signed: dto.signed ?? originalDoc.signed,
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
