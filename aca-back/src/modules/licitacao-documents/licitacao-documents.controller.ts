import { Body, Controller, Get, Param, Post, Delete, UploadedFile, UseGuards, UseInterceptors, Query, Res, Header } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../core/security/jwt-auth.guard';
import { CompanyGuard } from '../../core/tenancy/company.guard';
import { ActiveCompanyGuard } from '../../core/tenancy/active-company.guard';
import { ActiveCompany } from '../../core/tenancy/active-company.decorator';
import { RolesGuard } from '../../core/security/roles.guard';
import { Roles } from '../../core/security/roles.decorator';
import { CreateLicitacaoDocumentDto, UpdateLicitacaoDocumentDto, UploadLicitacaoDocumentDto, LicitacaoDocumentListQueryDto } from './dto/licitacao-document.dto';
import { LicitacaoDocumentsService } from './licitacao-documents.service';

@ApiTags('Licitacao Documents')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, ActiveCompanyGuard)
@Controller('licitacoes/:licitacaoId/documents')
export class LicitacaoDocumentsController {
  constructor(private readonly svc: LicitacaoDocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar documentos da licitação' })
  @ApiResponse({ status: 200, description: 'Lista de documentos com paginação' })
  list(@Param('licitacaoId') licitacaoId: string, @Query() query: LicitacaoDocumentListQueryDto) {
    return this.svc.findAll(licitacaoId, query.page, query.limit);
  }

  @Post()
  @ApiOperation({ summary: 'Criar documento sem arquivo' })
  @ApiResponse({ status: 201, description: 'Documento criado com sucesso' })
  create(@Param('licitacaoId') licitacaoId: string, @Body() dto: CreateLicitacaoDocumentDto) {
    return this.svc.create(licitacaoId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('owner', 'admin', 'member')
  @Post('upload')
  @ApiOperation({ summary: 'Upload de documento com arquivo' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: 'Documento enviado com sucesso' })
  async upload(
    @ActiveCompany() company: any,
    @Param('licitacaoId') licitacaoId: string,
    @Body() dto: UploadLicitacaoDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('Arquivo é obrigatório');
    }
    return this.svc.upload(licitacaoId, dto, file);
  }

  @Get(':id/content')
  @ApiOperation({ summary: 'Download do conteúdo do documento' })
  @ApiResponse({ status: 200, description: 'Conteúdo do documento' })
  @Header('Cache-Control', 'public, max-age=3600')
  async getContent(
    @Param('licitacaoId') licitacaoId: string,
    @Param('id') docId: string,
    @Res() res: Response,
  ) {
    const { filePath, downloadUrl, fileName } = await this.svc.getDocumentContent(licitacaoId, docId);
    
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileName}"`
    });
    
    res.redirect(downloadUrl);
  }

  @Get(':id/meta')
  @ApiOperation({ summary: 'Obter metadados do documento' })
  @ApiResponse({ status: 200, description: 'Metadados do documento' })
  getMeta(@Param('licitacaoId') licitacaoId: string, @Param('id') docId: string) {
    return this.svc.getDocumentMeta(licitacaoId, docId);
  }

  @UseGuards(RolesGuard)
  @Roles('owner', 'admin', 'member')
  @Delete(':id')
  @ApiOperation({ summary: 'Excluir documento' })
  @ApiResponse({ status: 200, description: 'Documento excluído com sucesso' })
  delete(@Param('licitacaoId') licitacaoId: string, @Param('id') docId: string) {
    return this.svc.deleteDocument(licitacaoId, docId);
  }

  @UseGuards(RolesGuard)
  @Roles('owner', 'admin', 'member')
  @Post(':id/reupload')
  @ApiOperation({ summary: 'Reupload de documento (nova versão)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: 'Nova versão do documento criada' })
  async reupload(
    @ActiveCompany() company: any,
    @Param('licitacaoId') licitacaoId: string,
    @Param('id') docId: string,
    @Body() dto: UploadLicitacaoDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('Arquivo é obrigatório');
    }
    return this.svc.reuploadDocument(company.id, licitacaoId, docId, dto, file);
  }
}
