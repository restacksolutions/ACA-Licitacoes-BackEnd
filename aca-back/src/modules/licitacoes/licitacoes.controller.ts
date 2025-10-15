import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { Request } from 'express';
import { LicitacoesService } from './licitacoes.service';

interface AuthenticatedRequest extends Request {
  companyId: string;
  user: {
    sub: string;
  };
}
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { CompanyGuard } from '../../common/guards/company.guard';
import {
  CreateLicitacaoDto,
  UpdateLicitacaoDto,
  CreateLicDocDto,
  UpdateLicDocDto,
  CreateLicEventDto,
} from './dto';

@ApiTags('Licitações')
@ApiBearerAuth('access')
@ApiBearerAuth('company-id')
@Controller('licitacoes')
@UseGuards(JwtAccessGuard, CompanyGuard)
export class LicitacoesController {
  constructor(private service: LicitacoesService) {}

  // CRUD licitações
  @Post()
  @ApiOperation({ summary: 'Criar nova licitação' })
  @ApiResponse({
    status: 201,
    description: 'Licitação criada com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        title: { type: 'string', example: 'Licitação para Serviços de TI' },
        status: { type: 'string', example: 'draft' },
        editalUrl: {
          type: 'string',
          example: 'https://example.com/edital.pdf',
        },
        sessionDate: { type: 'string', example: '2024-12-15T14:00:00.000Z' },
        submissionDeadline: {
          type: 'string',
          example: '2024-12-10T23:59:59.000Z',
        },
        companyId: {
          type: 'string',
          example: 'da6cc36e-b112-4301-ae6d-f824ccf944ad',
        },
        createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 403, description: 'Sem permissão para a empresa' })
  @ApiBody({ type: CreateLicitacaoDto })
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateLicitacaoDto) {
    return this.service.create(req.companyId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar licitações' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtrar por status',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Buscar por título',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de licitações',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          title: { type: 'string', example: 'Licitação para Serviços de TI' },
          status: { type: 'string', example: 'open' },
          editalUrl: {
            type: 'string',
            example: 'https://example.com/edital.pdf',
          },
          sessionDate: { type: 'string', example: '2024-12-15T14:00:00.000Z' },
          submissionDeadline: {
            type: 'string',
            example: '2024-12-10T23:59:59.000Z',
          },
          companyId: {
            type: 'string',
            example: 'da6cc36e-b112-4301-ae6d-f824ccf944ad',
          },
          createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 403, description: 'Sem permissão para a empresa' })
  list(
    @Req() req: AuthenticatedRequest,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.service.list(req.companyId, status, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter licitação por ID' })
  @ApiParam({ name: 'id', description: 'ID da licitação' })
  @ApiResponse({
    status: 200,
    description: 'Licitação encontrada',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        title: { type: 'string', example: 'Licitação para Serviços de TI' },
        status: { type: 'string', example: 'open' },
        editalUrl: {
          type: 'string',
          example: 'https://example.com/edital.pdf',
        },
        sessionDate: { type: 'string', example: '2024-12-15T14:00:00.000Z' },
        submissionDeadline: {
          type: 'string',
          example: '2024-12-10T23:59:59.000Z',
        },
        companyId: {
          type: 'string',
          example: 'da6cc36e-b112-4301-ae6d-f824ccf944ad',
        },
        createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Licitação não encontrada' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 403, description: 'Sem permissão para a empresa' })
  get(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.service.get(req.companyId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar licitação' })
  @ApiParam({ name: 'id', description: 'ID da licitação' })
  @ApiBody({ type: UpdateLicitacaoDto })
  @ApiResponse({ status: 200, description: 'Licitação atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Licitação não encontrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 403, description: 'Sem permissão para a empresa' })
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateLicitacaoDto,
  ) {
    return this.service.update(req.companyId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir licitação' })
  @ApiParam({ name: 'id', description: 'ID da licitação' })
  @ApiResponse({ status: 200, description: 'Licitação excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Licitação não encontrada' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 403, description: 'Sem permissão para a empresa' })
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.service.remove(req.companyId, id);
  }

  // Documentos da licitação (metadados)
  @Get(':id/documents')
  @ApiOperation({ summary: 'Listar documentos da licitação' })
  @ApiParam({ name: 'id', description: 'ID da licitação' })
  @ApiResponse({
    status: 200,
    description: 'Lista de documentos',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'doc-123e4567-e89b-12d3-a456-426614174000',
          },
          name: { type: 'string', example: 'Proposta Técnica' },
          docType: { type: 'string', example: 'proposta' },
          required: { type: 'boolean', example: true },
          submitted: { type: 'boolean', example: false },
          signed: { type: 'boolean', example: false },
          issueDate: { type: 'string', example: '2024-01-15T00:00:00.000Z' },
          expiresAt: { type: 'string', example: '2024-12-31T23:59:59.000Z' },
          notes: {
            type: 'string',
            example: 'Documento obrigatório para participação',
          },
          licitacaoId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 403, description: 'Sem permissão para a empresa' })
  listDocs(@Param('id') id: string) {
    return this.service.listDocs(id);
  }

  @Post(':id/documents')
  @ApiOperation({ summary: 'Adicionar documento à licitação' })
  @ApiParam({ name: 'id', description: 'ID da licitação' })
  @ApiBody({ type: CreateLicDocDto })
  @ApiResponse({
    status: 201,
    description: 'Documento adicionado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'doc-123e4567-e89b-12d3-a456-426614174000',
        },
        name: { type: 'string', example: 'Proposta Técnica' },
        docType: { type: 'string', example: 'proposta' },
        required: { type: 'boolean', example: true },
        submitted: { type: 'boolean', example: false },
        signed: { type: 'boolean', example: false },
        issueDate: { type: 'string', example: '2024-01-15T00:00:00.000Z' },
        expiresAt: { type: 'string', example: '2024-12-31T23:59:59.000Z' },
        notes: {
          type: 'string',
          example: 'Documento obrigatório para participação',
        },
        licitacaoId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 403, description: 'Sem permissão para a empresa' })
  addDoc(@Param('id') id: string, @Body() dto: CreateLicDocDto) {
    return this.service.addDoc(id, dto);
  }

  @Patch(':id/documents/:docId')
  @ApiOperation({ summary: 'Atualizar documento da licitação' })
  @ApiParam({ name: 'id', description: 'ID da licitação' })
  @ApiParam({ name: 'docId', description: 'ID do documento' })
  @ApiBody({ type: UpdateLicDocDto })
  @ApiResponse({ status: 200, description: 'Documento atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 403, description: 'Sem permissão para a empresa' })
  updateDoc(
    @Param('id') id: string,
    @Param('docId') docId: string,
    @Body() dto: UpdateLicDocDto,
  ) {
    return this.service.updateDoc(id, docId, dto);
  }

  @Delete(':id/documents/:docId')
  @ApiOperation({ summary: 'Remover documento da licitação' })
  @ApiParam({ name: 'id', description: 'ID da licitação' })
  @ApiParam({ name: 'docId', description: 'ID do documento' })
  @ApiResponse({ status: 200, description: 'Documento removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 403, description: 'Sem permissão para a empresa' })
  removeDoc(@Param('id') id: string, @Param('docId') docId: string) {
    return this.service.removeDoc(id, docId);
  }

  // Eventos
  @Get(':id/events')
  @ApiOperation({ summary: 'Listar eventos da licitação' })
  @ApiParam({ name: 'id', description: 'ID da licitação' })
  @ApiResponse({
    status: 200,
    description: 'Lista de eventos',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'event-123e4567-e89b-12d3-a456-426614174000',
          },
          type: { type: 'string', example: 'status_changed' },
          payload: {
            type: 'object',
            example: {
              from: 'draft',
              to: 'open',
              reason: 'Licitação publicada',
            },
          },
          licitacaoId: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          createdById: {
            type: 'string',
            example: 'user-123e4567-e89b-12d3-a456-426614174000',
          },
          createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 403, description: 'Sem permissão para a empresa' })
  listEvents(@Param('id') id: string) {
    return this.service.listEvents(id);
  }

  @Post(':id/events')
  @ApiOperation({ summary: 'Adicionar evento à licitação' })
  @ApiParam({ name: 'id', description: 'ID da licitação' })
  @ApiBody({ type: CreateLicEventDto })
  @ApiResponse({
    status: 201,
    description: 'Evento adicionado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'event-123e4567-e89b-12d3-a456-426614174000',
        },
        type: { type: 'string', example: 'status_changed' },
        payload: {
          type: 'object',
          example: {
            from: 'draft',
            to: 'open',
            reason: 'Licitação publicada',
          },
        },
        licitacaoId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        createdById: {
          type: 'string',
          example: 'user-123e4567-e89b-12d3-a456-426614174000',
        },
        createdAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 403, description: 'Sem permissão para a empresa' })
  addEvent(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: CreateLicEventDto,
  ) {
    return this.service.addEvent(id, dto, req.user.sub);
  }

  // Summary
  @Get(':id/summary')
  @ApiOperation({ summary: 'Obter resumo da licitação' })
  @ApiParam({ name: 'id', description: 'ID da licitação' })
  @ApiResponse({
    status: 200,
    description: 'Resumo da licitação',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', description: 'Total de documentos' },
        required: { type: 'number', description: 'Documentos obrigatórios' },
        submitted: { type: 'number', description: 'Documentos entregues' },
        signed: { type: 'number', description: 'Documentos assinados' },
        coveragePercent: {
          type: 'number',
          description: 'Percentual de cobertura',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Licitação não encontrada' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 403, description: 'Sem permissão para a empresa' })
  summary(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.service.summary(req.companyId, id);
  }
}
