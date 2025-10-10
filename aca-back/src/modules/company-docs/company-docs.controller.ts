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
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CompanyDocsService } from './company-docs.service';
import { CreateCompanyDocDto, UpdateCompanyDocDto } from './dto';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { CompanyGuard } from '../../common/guards/company.guard';
import { requireAdminOrOwner } from '../../common/utils/roles.util';

interface RequestWithCompanyId {
  companyId: string;
  membership?: { role?: string };
}

@ApiTags('company-docs')
@Controller('company-docs')
@UseGuards(JwtAccessGuard, CompanyGuard)
@ApiBearerAuth('access')
export class CompanyDocsController {
  constructor(private service: CompanyDocsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo documento institucional' })
  @ApiResponse({
    status: 201,
    description: 'Documento criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou tipo de arquivo não permitido',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas admin/owner',
  })
  create(@Req() req: RequestWithCompanyId, @Body() dto: CreateCompanyDocDto) {
    requireAdminOrOwner(req); // criação/alteração apenas admin/owner
    return this.service.create(req.companyId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar documentos institucionais',
    description:
      'Lista documentos com filtros opcionais por status e janela de dias',
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
    type: 'string',
    description: 'Janela de dias para filtro (usado com status=expiring)',
    example: '15',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de documentos retornada com sucesso',
  })
  list(
    @Req() req: RequestWithCompanyId,
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
  @ApiOperation({ summary: 'Buscar documento por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único do documento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Documento encontrado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Documento não encontrado',
  })
  async get(@Req() req: RequestWithCompanyId, @Param('id') id: string) {
    return this.service.get(req.companyId, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar documento institucional',
    description:
      'Atualiza dados do documento. A versão incrementa automaticamente ao trocar arquivo.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do documento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Documento atualizado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas admin/owner',
  })
  @ApiResponse({
    status: 404,
    description: 'Documento não encontrado',
  })
  async update(
    @Req() req: RequestWithCompanyId,
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDocDto,
  ) {
    requireAdminOrOwner(req);
    return this.service.update(req.companyId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir documento institucional' })
  @ApiParam({
    name: 'id',
    description: 'ID único do documento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Documento excluído com sucesso',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - apenas admin/owner',
  })
  @ApiResponse({
    status: 404,
    description: 'Documento não encontrado',
  })
  async remove(@Req() req: RequestWithCompanyId, @Param('id') id: string) {
    requireAdminOrOwner(req);
    return this.service.remove(req.companyId, id);
  }
}
