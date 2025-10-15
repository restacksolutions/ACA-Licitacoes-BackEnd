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
  ApiHeader,
} from '@nestjs/swagger';
import { CompanyDocsService } from './company-docs.service';
import { CreateCompanyDocDto, UpdateCompanyDocDto } from './dto';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { CompanyGuard } from '../../common/guards/company.guard';
import { requireAdminOrOwner } from '../../common/utils/roles.util';
import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
  companyId: string;
  user: any;
  membership?: { role?: string };
}

@ApiTags('company-docs')
@Controller('company-docs')
@UseGuards(JwtAccessGuard, CompanyGuard)
@ApiBearerAuth('access')
@ApiBearerAuth('company-id')
export class CompanyDocsController {
  constructor(private service: CompanyDocsService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar documento da empresa',
    description:
      'Cria um novo documento para a empresa. Apenas admin/owner podem criar documentos. Envie o companyId via header X-Company-Id ou campo company_id no body.',
  })
  @ApiResponse({
    status: 201,
    description: 'Documento criado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        clientName: 'Empresa ABC Ltda',
        docType: 'Contrato de Prestação de Serviços',
        issueDate: '2024-01-15T00:00:00.000Z',
        expiresAt: '2024-12-31T23:59:59.000Z',
        notes: 'Contrato de prestação de serviços de consultoria',
        companyId: '456e7890-e89b-12d3-a456-426614174001',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token de acesso inválido' })
  @ApiResponse({
    status: 403,
    description: 'Apenas admin/owner podem criar documentos',
  })
  @ApiBody({
    type: CreateCompanyDocDto,
    examples: {
      'Contrato de Serviços': {
        summary: 'Contrato de Prestação de Serviços',
        value: {
          company_id: 'da6cc36e-b112-4301-ae6d-f824ccf944ad',
          clientName: 'Empresa ABC Ltda',
          docType: 'Contrato de Prestação de Serviços',
          issueDate: '2024-01-15T00:00:00.000Z',
          expiresAt: '2024-12-31T23:59:59.000Z',
          notes: 'Contrato de prestação de serviços de consultoria',
        },
      },
      'Certificado ISO': {
        summary: 'Certificado ISO 9001',
        value: {
          company_id: 'da6cc36e-b112-4301-ae6d-f824ccf944ad',
          clientName: 'Certificadora XYZ',
          docType: 'Certificado ISO 9001',
          issueDate: '2024-01-01T00:00:00.000Z',
          expiresAt: '2025-01-01T23:59:59.000Z',
          notes: 'Certificado de qualidade ISO 9001:2015',
        },
      },
    },
  })
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateCompanyDocDto) {
    requireAdminOrOwner(req); // somente admin/owner
    return this.service.create(req.companyId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar documentos da empresa',
    description:
      'Lista todos os documentos da empresa com filtros opcionais por status e período.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['valid', 'expiring', 'expired'],
    description: 'Filtrar por status do documento',
  })
  @ApiQuery({
    name: 'inDays',
    required: false,
    type: String,
    description: 'Filtrar documentos que expiram em X dias',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de documentos retornada com sucesso',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          clientName: 'Empresa ABC Ltda',
          docType: 'Contrato de Prestação de Serviços',
          issueDate: '2024-01-15T00:00:00.000Z',
          expiresAt: '2024-12-31T23:59:59.000Z',
          notes: 'Contrato de prestação de serviços de consultoria',
          status: 'valid',
          daysToExpire: 45,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Token de acesso inválido' })
  list(
    @Req() req: AuthenticatedRequest,
    @Query('status') status?: 'valid' | 'expiring' | 'expired',
    @Query('inDays') inDays?: string,
  ) {
    return this.service.list(
      req.companyId,
      status,
      inDays ? parseInt(inDays) : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obter documento específico',
    description: 'Retorna os detalhes de um documento específico da empresa.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do documento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Documento encontrado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        clientName: 'Empresa ABC Ltda',
        docType: 'Contrato de Prestação de Serviços',
        issueDate: '2024-01-15T00:00:00.000Z',
        expiresAt: '2024-12-31T23:59:59.000Z',
        notes: 'Contrato de prestação de serviços de consultoria',
        fileName: 'contrato_abc_2024.pdf',
        fileMime: 'application/pdf',
        fileSize: 245760,
        version: 1,
        companyId: '456e7890-e89b-12d3-a456-426614174001',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  @ApiResponse({ status: 401, description: 'Token de acesso inválido' })
  get(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.service.get(req.companyId, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar documento',
    description:
      'Atualiza os dados de um documento existente. Apenas admin/owner podem atualizar.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do documento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Documento atualizado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        clientName: 'Empresa ABC Ltda - Atualizada',
        docType: 'Contrato de Prestação de Serviços',
        issueDate: '2024-01-15T00:00:00.000Z',
        expiresAt: '2024-12-31T23:59:59.000Z',
        notes: 'Contrato atualizado com novas cláusulas',
        version: 2,
        updatedAt: '2024-01-20T14:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  @ApiResponse({ status: 401, description: 'Token de acesso inválido' })
  @ApiResponse({
    status: 403,
    description: 'Apenas admin/owner podem atualizar documentos',
  })
  @ApiBody({
    type: UpdateCompanyDocDto,
    examples: {
      'Atualizar Cliente': {
        summary: 'Atualizar nome do cliente',
        value: {
          clientName: 'Empresa ABC Ltda - Novo Nome',
        },
      },
      'Atualizar Data de Expiração': {
        summary: 'Prorrogar contrato',
        value: {
          expiresAt: '2025-12-31T23:59:59.000Z',
          notes: 'Contrato prorrogado por mais um ano',
        },
      },
    },
  })
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDocDto,
  ) {
    requireAdminOrOwner(req);
    return this.service.update(req.companyId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Excluir documento',
    description:
      'Remove um documento da empresa. Apenas admin/owner podem excluir.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do documento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Documento excluído com sucesso',
    schema: {
      example: {
        message: 'Documento excluído com sucesso',
        id: '123e4567-e89b-12d3-a456-426614174000',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  @ApiResponse({ status: 401, description: 'Token de acesso inválido' })
  @ApiResponse({
    status: 403,
    description: 'Apenas admin/owner podem excluir documentos',
  })
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    requireAdminOrOwner(req);
    return this.service.remove(req.companyId, id);
  }
}
