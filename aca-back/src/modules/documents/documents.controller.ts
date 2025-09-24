import { Body, Controller, Get, Param, Post, Delete, Patch, UploadedFile, UseGuards, UseInterceptors, Query, Res, Header } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../core/security/jwt-auth.guard';
import { CompanyGuard } from '../../core/tenancy/company.guard';
import { CreateCompanyDocDto, UpdateCompanyDocDto, CompanyDocResponseDto, UploadDocumentDto, DocumentListQueryDto } from './dto/doc.dto';
import { DocumentsService } from './documents.service';

@ApiTags('Company Documents')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, CompanyGuard)
@Controller('companies/:companyId/documents')
export class DocumentsController {
  constructor(private readonly svc: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar documentos da empresa' })
  @ApiResponse({ status: 200, description: 'Lista de documentos com paginação' })
  list(@Param('companyId') companyId: string, @Query() query: DocumentListQueryDto) {
    return this.svc.list(companyId, query);
  }

  @Post()
  @ApiOperation({ summary: 'Criar documento sem arquivo' })
  @ApiResponse({ status: 201, description: 'Documento criado com sucesso' })
  create(@Param('companyId') companyId: string, @Body() dto: CreateCompanyDocDto) {
    return this.svc.create(companyId, dto);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload de documento com arquivo' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: 'Documento enviado com sucesso' })
  async upload(
    @Param('companyId') companyId: string,
    @Body() dto: UploadDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(`[DocumentsController.upload] ===== INICIANDO UPLOAD =====`);
    console.log(`[DocumentsController.upload] CompanyId: ${companyId}`);
    console.log(`[DocumentsController.upload] DTO:`, dto);
    console.log(`[DocumentsController.upload] File:`, file ? {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    } : 'null');
    
    try {
      if (!file) {
        console.log(`[DocumentsController.upload] Arquivo não fornecido`);
        throw new Error('Arquivo é obrigatório');
      }
      
      const result = await this.svc.upload(companyId, dto, file);
      console.log(`[DocumentsController.upload] Upload realizado com sucesso`);
      return result;
    } catch (error) {
      console.error(`[DocumentsController.upload] Erro no upload:`, error);
      throw error;
    }
  }

  @Get(':id/content')
  @ApiOperation({ summary: 'Download do conteúdo do documento' })
  @ApiResponse({ status: 200, description: 'Conteúdo do documento' })
  @Header('Cache-Control', 'public, max-age=3600')
  async getContent(
    @Param('companyId') companyId: string,
    @Param('id') docId: string,
    @Res() res: Response,
  ) {
    const { buffer, mimeType, sha256Hex } = await this.svc.getDocumentContent(companyId, docId);
    
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
  getMeta(@Param('companyId') companyId: string, @Param('id') docId: string) {
    return this.svc.getDocumentMeta(companyId, docId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar metadados do documento' })
  @ApiResponse({ status: 200, description: 'Documento atualizado com sucesso' })
  update(@Param('companyId') companyId: string, @Param('id') docId: string, @Body() dto: UpdateCompanyDocDto) {
    return this.svc.updateDocument(companyId, docId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir documento' })
  @ApiResponse({ status: 200, description: 'Documento excluído com sucesso' })
  async delete(@Param('companyId') companyId: string, @Param('id') docId: string) {
    try {
      const result = await this.svc.deleteDocument(companyId, docId);
      return { success: true, message: 'Documento excluído com sucesso', data: result };
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      throw error;
    }
  }

  @Post(':id/reupload')
  @ApiOperation({ summary: 'Reupload de documento (nova versão)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: 'Nova versão do documento criada' })
  async reupload(
    @Param('companyId') companyId: string,
    @Param('id') docId: string,
    @Body() dto: UploadDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('Arquivo é obrigatório');
    }
    return this.svc.reuploadDocument(companyId, docId, dto, file);
  }
}
