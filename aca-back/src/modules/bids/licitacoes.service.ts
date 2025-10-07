import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateLicitacaoDto, UpdateLicitacaoDto, LicitacaoListQueryDto, AnalisarEditalDto } from './dto/licitacao.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LicitacoesService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async list(companyId: string, query: LicitacaoListQueryDto) {
    const { status, page = 1, pageSize = 10, search } = query;
    const skip = (page - 1) * pageSize;

    const where: any = {
      companyId,
      ...(status && { status }),
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { orgao: { contains: search, mode: 'insensitive' } },
        { modalidade: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [licitacoes, total] = await Promise.all([
      this.prisma.licitacao.findMany({
        where,
        select: {
          id: true,
          title: true,
          orgao: true,
          modalidade: true,
          editalUrl: true,
          sessionAt: true,
          submissionDeadline: true,
          status: true,
          saleValue: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.licitacao.count({ where }),
    ]);

    return {
      licitacoes,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async create(companyId: string, dto: CreateLicitacaoDto) {
    return this.prisma.licitacao.create({
      data: {
        companyId,
        title: dto.title,
        orgao: dto.orgao,
        modalidade: dto.modalidade,
        editalUrl: dto.editalUrl,
        sessionAt: dto.sessionAt ? new Date(dto.sessionAt) : null,
        submissionDeadline: dto.submissionDeadline ? new Date(dto.submissionDeadline) : null,
        status: dto.status || 'DRAFT' as any,
        saleValue: dto.saleValue ? parseFloat(dto.saleValue) : null,
        notes: dto.notes,
      },
    });
  }

  async get(companyId: string, id: string) {
    try {
      console.log(`[LicitacoesService.get] Buscando licitação: ${id} para empresa: ${companyId}`);
      
      // Primeiro, buscar apenas a licitação sem documentos
      const licitacao = await this.prisma.licitacao.findFirst({
        where: { id, companyId },
      });

      if (!licitacao) {
        console.log(`[LicitacoesService.get] Licitação não encontrada: ${id}`);
        throw new NotFoundException('Licitação não encontrada');
      }

      console.log(`[LicitacoesService.get] Licitação encontrada: ${licitacao.title}`);

      // Buscar documentos separadamente
      const documents = await this.prisma.licitacaoDocument.findMany({
        where: { licitacaoId: id },
        orderBy: { docType: 'asc' },
        select: {
          id: true,
          docType: true,
          required: true,
          submitted: true,
          signed: true,
          issueDate: true,
          expiresAt: true,
          version: true,
          notes: true,},
      });

      console.log(`[LicitacoesService.get] Documentos encontrados: ${documents.length}`);

      // Calcular painel de conformidade
      const conformidade = await this.calculateConformidade(licitacao.id);

      // Converter Decimal para string para serialização JSON
      const result = {
        ...licitacao,
        saleValue: licitacao.saleValue ? licitacao.saleValue.toString() : null,
        documents: documents.map(doc => ({
          ...doc,
        })),
        conformidade,
      };

      console.log(`[LicitacoesService.get] Retornando licitação com conformidade`);
      return result;
    } catch (error) {
      console.error(`[LicitacoesService.get] Erro ao buscar licitação:`, error);
      throw error;
    }
  }

  async update(companyId: string, id: string, dto: UpdateLicitacaoDto) {
    const licitacao = await this.prisma.licitacao.findFirst({
      where: { id, companyId },
    });

    if (!licitacao) {
      throw new NotFoundException('Licitação não encontrada');
    }

    return this.prisma.licitacao.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.orgao && { orgao: dto.orgao }),
        ...(dto.modalidade && { modalidade: dto.modalidade }),
        ...(dto.editalUrl && { editalUrl: dto.editalUrl }),
        ...(dto.sessionAt && { sessionAt: new Date(dto.sessionAt) }),
        ...(dto.submissionDeadline && { submissionDeadline: new Date(dto.submissionDeadline) }),
        ...(dto.status && { status: dto.status as any }),
        ...(dto.saleValue && { saleValue: parseFloat(dto.saleValue) }),
        ...(dto.notes && { notes: dto.notes }),
      },
    });
  }

  async remove(companyId: string, id: string) {
    const licitacao = await this.prisma.licitacao.findFirst({
      where: { id, companyId },
    });

    if (!licitacao) {
      throw new NotFoundException('Licitação não encontrada');
    }

    // Excluir documentos relacionados primeiro
    await this.prisma.licitacaoDocument.deleteMany({
      where: { licitacaoId: id },
    });

    return this.prisma.licitacao.delete({
      where: { id },
    });
  }

  async analisarEdital(companyId: string, id: string, dto: AnalisarEditalDto) {
    const licitacao = await this.prisma.licitacao.findFirst({
      where: { id, companyId },
    });

    if (!licitacao) {
      throw new NotFoundException('Licitação não encontrada');
    }

    if (!licitacao.editalUrl) {
      throw new BadRequestException('Licitação deve ter URL do edital para análise');
    }

    try {
      // Chamar webhook do n8n para análise
      const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/analisar-edital';
      
      const payload = {
        licitacao_id: id,
        edital_url: licitacao.editalUrl,
        company_id: companyId,
        ...dto,
      };

      const response = await firstValueFrom(
        this.httpService.post(n8nWebhookUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 segundos
        })
      );

      return {
        success: true,
        message: 'Análise do edital iniciada',
        data: (response as any).data,
      };
    } catch (error) {
      console.error('Erro ao chamar webhook n8n:', error);
      throw new BadRequestException('Erro ao iniciar análise do edital');
    }
  }

  async getDocuments(companyId: string, id: string) {
    const licitacao = await this.prisma.licitacao.findFirst({
      where: { id, companyId },
    });

    if (!licitacao) {
      throw new NotFoundException('Licitação não encontrada');
    }

    const documents = await this.prisma.licitacaoDocument.findMany({
      where: { licitacaoId: id },
      orderBy: [
        { required: 'desc' },
        { docType: 'asc' },
      ],
    });

    return documents;
  }

  async getConformidade(companyId: string, id: string) {
    const licitacao = await this.prisma.licitacao.findFirst({
      where: { id, companyId },
    });

    if (!licitacao) {
      throw new NotFoundException('Licitação não encontrada');
    }

    return this.calculateConformidade(id);
  }

  private async calculateConformidade(licitacaoId: string) {
    try {
      console.log(`[LicitacoesService.calculateConformidade] Calculando conformidade para licitação: ${licitacaoId}`);
      
      const documents = await this.prisma.licitacaoDocument.findMany({
        where: { licitacaoId },
      });

      console.log(`[LicitacoesService.calculateConformidade] Documentos encontrados: ${documents.length}`);

      const totalRequired = documents.filter(doc => doc.required).length;
      const totalSubmitted = documents.filter(doc => doc.required && doc.submitted).length;
      const totalSigned = documents.filter(doc => doc.required && doc.submitted && doc.signed).length;

      const coberturaPercentual = totalRequired > 0 ? (totalSubmitted / totalRequired) * 100 : 0;
      const assinaturaPercentual = totalSubmitted > 0 ? (totalSigned / totalSubmitted) * 100 : 0;

      const pendentes = documents
        .filter(doc => doc.required && !doc.submitted)
        .map(doc => ({
          docType: doc.docType,
          required: doc.required,
          submitted: doc.submitted,
          signed: doc.signed,
        }));

      const result = {
        totalRequired,
        totalSubmitted,
        totalSigned,
        coberturaPercentual: Math.round(coberturaPercentual * 100) / 100,
        assinaturaPercentual: Math.round(assinaturaPercentual * 100) / 100,
        pendentes,
        documents: documents.map(doc => ({
          id: doc.id,
          docType: doc.docType,
          required: doc.required,
          submitted: doc.submitted,
          signed: doc.signed,
          issueDate: doc.issueDate,
          expiresAt: doc.expiresAt,
          version: doc.version,
          notes: doc.notes,
          // Converter BigInt para string se existir
        })),
      };

      console.log(`[LicitacoesService.calculateConformidade] Conformidade calculada:`, {
        totalRequired,
        totalSubmitted,
        totalSigned,
        coberturaPercentual: result.coberturaPercentual
      });

      return result;
    } catch (error) {
      console.error(`[LicitacoesService.calculateConformidade] Erro ao calcular conformidade:`, error);
      throw error;
    }
  }

  // Método para receber webhook do n8n com resultado da análise
  async processarAnaliseEdital(payload: any) {
    const { licitacao_id, required_documents, vehicle_hints } = payload;

    if (!licitacao_id || !required_documents) {
      throw new BadRequestException('Payload inválido');
    }

    // Limpar documentos existentes da licitação
    await this.prisma.licitacaoDocument.deleteMany({
      where: { licitacaoId: licitacao_id },
    });

    // Criar novos documentos baseados na análise
    const documents = required_documents.map((doc: any) => ({
      licitacaoId: licitacao_id,
      docType: doc.doc_type,
      required: doc.required || true,
      submitted: false,
      signed: false,
      notes: `Documento identificado automaticamente via análise do edital`,
    }));

    await this.prisma.licitacaoDocument.createMany({
      data: documents,
    });

    // Atualizar licitação com sugestões de veículos se fornecidas
    if (vehicle_hints && vehicle_hints.length > 0) {
      // Buscar a licitação para obter as notas atuais
      const licitacao = await this.prisma.licitacao.findUnique({
        where: { id: licitacao_id },
        select: { notes: true },
      });

      await this.prisma.licitacao.update({
        where: { id: licitacao_id },
        data: {
          notes: `${licitacao?.notes || ''}\n\nSugestões de veículos identificadas:\n${vehicle_hints.map((hint: any) => `- ${hint.brand} ${hint.model}: ${hint.criteria}`).join('\n')}`,
        },
      });
    }

    return {
      success: true,
      message: 'Análise do edital processada com sucesso',
      documentsCreated: documents.length,
    };
  }
}
