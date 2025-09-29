import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/security/jwt-auth.guard';
import { ActiveCompanyGuard } from '../../core/tenancy/active-company.guard';
import { ActiveCompany } from '../../core/tenancy/active-company.decorator';
import { RolesGuard } from '../../core/security/roles.guard';
import { Roles } from '../../core/security/roles.decorator';
import { LicitacoesService } from './licitacoes.service';
import { CreateLicitacaoDto, UpdateLicitacaoDto, LicitacaoResponseDto, LicitacaoListQueryDto, AnalisarEditalDto } from './dto/licitacao.dto';

@ApiTags('Licitações')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, ActiveCompanyGuard)
@Controller('licitacoes')
export class LicitacoesController {
  constructor(private readonly svc: LicitacoesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar licitações da empresa ativa' })
  @ApiResponse({ status: 200, description: 'Lista de licitações com paginação' })
  list(@ActiveCompany() company: any, @Query() query: LicitacaoListQueryDto) {
    return this.svc.list(company.id, query);
  }

  @UseGuards(RolesGuard)
  @Roles('owner', 'admin', 'member')
  @Post()
  @ApiOperation({ summary: 'Criar nova licitação' })
  @ApiResponse({ status: 201, description: 'Licitação criada com sucesso' })
  create(@ActiveCompany() company: any, @Body() dto: CreateLicitacaoDto) {
    return this.svc.create(company.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes da licitação' })
  @ApiResponse({ status: 200, description: 'Detalhes da licitação com painel de conformidade' })
  get(@ActiveCompany() company: any, @Param('id') id: string) {
    console.log(`[LicitacoesController.get] Recebida requisição para licitação: ${id}, empresa: ${company?.id}`);
    try {
      const result = this.svc.get(company.id, id);
      console.log(`[LicitacoesController.get] Serviço chamado com sucesso`);
      return result;
    } catch (error) {
      console.error(`[LicitacoesController.get] Erro no controller:`, error);
      throw error;
    }
  }

  @UseGuards(RolesGuard)
  @Roles('owner', 'admin', 'member')
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar licitação' })
  @ApiResponse({ status: 200, description: 'Licitação atualizada com sucesso' })
  update(@ActiveCompany() company: any, @Param('id') id: string, @Body() dto: UpdateLicitacaoDto) {
    return this.svc.update(company.id, id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('owner', 'admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Excluir licitação' })
  @ApiResponse({ status: 200, description: 'Licitação excluída com sucesso' })
  remove(@ActiveCompany() company: any, @Param('id') id: string) {
    return this.svc.remove(company.id, id);
  }

  @UseGuards(RolesGuard)
  @Roles('owner', 'admin', 'member')
  @Post(':id/analisar-edital')
  @ApiOperation({ summary: 'Analisar edital via n8n' })
  @ApiResponse({ status: 200, description: 'Análise do edital iniciada' })
  analisarEdital(@ActiveCompany() company: any, @Param('id') id: string, @Body() dto: AnalisarEditalDto) {
    return this.svc.analisarEdital(company.id, id, dto);
  }

  @Get(':id/documents')
  @ApiOperation({ summary: 'Listar documentos da licitação' })
  @ApiResponse({ status: 200, description: 'Lista de documentos requeridos e submetidos' })
  getDocuments(@ActiveCompany() company: any, @Param('id') id: string) {
    return this.svc.getDocuments(company.id, id);
  }

  @Get(':id/conformidade')
  @ApiOperation({ summary: 'Obter painel de conformidade' })
  @ApiResponse({ status: 200, description: 'Painel de conformidade com percentual de cobertura' })
  getConformidade(@ActiveCompany() company: any, @Param('id') id: string) {
    return this.svc.getConformidade(company.id, id);
  }
}
