import { Body, Controller, Get, Param, Post, Delete, UploadedFile, UseGuards, UseInterceptors, Query, Res, Header } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../core/security/jwt-auth.guard';
import { CompanyGuard } from '../../core/tenancy/company.guard';
import { CreateLicitacaoDocDto, UpdateLicitacaoDocDto, LicitacaoDocResponseDto, UploadLicitacaoDocumentDto, LicitacaoDocumentListQueryDto } from './dto/licitacao-doc.dto';
import { LicitacaoDocumentsService } from './licitacao-documents.service';

@ApiTags('Licitacao Documents')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, CompanyGuard)
@Controller('licitacoes/:licitacaoId/documents')
export class LicitacaoDocumentsController {
  constructor(private readonly svc: LicitacaoDocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar documentos da licitação' })
  @ApiResponse({ status: 200, description: 'Lista de documentos com paginação' })
  list(@Param('licitacaoId') licitacaoId: string, @Query() query: LicitacaoDocumentListQueryDto) {
    return this.svc.list(licitacaoId, query);
  }

  @Post()
  @ApiOperation({ summary: 'Criar documento sem arquivo' })
  @ApiResponse({ status: 201, description: 'Documento criado com sucesso' })
  create(@Param('licitacaoId') licitacaoId: string, @Body() dto: CreateLicitacaoDocDto) {
    return this.svc.create(licitacaoId, dto);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload de documento com arquivo' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: 'Documento enviado com sucesso' })
  async upload(
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
    const { buffer, mimeType, sha256Hex } = await this.svc.getDocumentContent(licitacaoId, docId);
    
    res.set({
      'Content-Type': mimeType,
      'ETag': sha256Hex,
      'Content-Length': buffer.length.toString(),
    });
    
    res.send(buffer);
  }

  @Get(':id/meta')
  @ApiOperation({ summary: 'Obter metadados do documento' })
  @ApiResponse({ status: 200, description: 'Metadados do documento' })
  getMeta(@Param('licitacaoId') licitacaoId: string, @Param('id') docId: string) {
    return this.svc.getDocumentMeta(licitacaoId, docId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir documento' })
  @ApiResponse({ status: 200, description: 'Documento excluído com sucesso' })
  delete(@Param('licitacaoId') licitacaoId: string, @Param('id') docId: string) {
    return this.svc.deleteDocument(licitacaoId, docId);
  }

  @Post(':id/reupload')
  @ApiOperation({ summary: 'Reupload de documento (nova versão)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: 'Nova versão do documento criada' })
  async reupload(
    @Param('licitacaoId') licitacaoId: string,
    @Param('id') docId: string,
    @Body() dto: UploadLicitacaoDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('Arquivo é obrigatório');
    }
    return this.svc.reuploadDocument(licitacaoId, docId, dto, file);
  }
}
