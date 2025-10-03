import { Body, Controller, Get, Param, Post, Delete, Patch, UploadedFile, UseGuards, UseInterceptors, Query, Res, Header } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../core/security/jwt-auth.guard';
import { ActiveCompany } from '../../core/tenancy/active-company.decorator';
import { CreateCompanyDocDto, UpdateCompanyDocDto, UploadDocumentDto, DocumentListQueryDto } from './dto/document.dto';
import { DocumentsService } from './documents.service';

@ApiTags('Company Documents')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly svc: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar documentos da empresa' })
  @ApiResponse({ status: 200, description: 'Lista de documentos com paginação' })
  list(@ActiveCompany() company: any, @Query() query: DocumentListQueryDto) {
    return this.svc.findAll(company.id, query.page, query.limit, query.search);
  }

  @Post()
  @ApiOperation({ summary: 'Criar documento sem arquivo' })
  @ApiResponse({ status: 201, description: 'Documento criado com sucesso' })
  create(@ActiveCompany() company: any, @Body() dto: CreateCompanyDocDto) {
    return this.svc.create(company.id, dto);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload de documento com arquivo' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: 'Documento enviado com sucesso' })
  async upload(
    @ActiveCompany() company: any,
    @Body() dto: UploadDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(`[DocumentsController.upload] ===== INICIANDO UPLOAD =====`);
    console.log(`[DocumentsController.upload] CompanyId: ${company.id}`);
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

      // Validar se docType é válido
      const validDocTypes = ['cnpj', 'certidao', 'procuracao', 'inscricao_estadual', 'outro'];
      if (!validDocTypes.includes(dto.docType)) {
        throw new Error(`docType deve ser um dos seguintes valores: ${validDocTypes.join(', ')}`);
      }
      
      const result = await this.svc.upload(company.id, dto, file);
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
    @ActiveCompany() company: any,
    @Param('id') docId: string,
    @Res() res: Response,
  ) {
    const { fileName, content, mimeType } = await this.svc.getDocumentContent(company.id, docId);
    
    res.set({
      'Content-Type': mimeType || 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': content.length.toString()
    });
    
    res.send(content);
  }

  @Get(':id/meta')
  @ApiOperation({ summary: 'Obter metadados do documento' })
  @ApiResponse({ status: 200, description: 'Metadados do documento' })
  getMeta(@ActiveCompany() company: any, @Param('id') docId: string) {
    return this.svc.getDocumentMeta(company.id, docId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar metadados do documento' })
  @ApiResponse({ status: 200, description: 'Documento atualizado com sucesso' })
  update(@ActiveCompany() company: any, @Param('id') docId: string, @Body() dto: UpdateCompanyDocDto) {
    return this.svc.updateDocument(company.id, docId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir documento' })
  @ApiResponse({ status: 200, description: 'Documento excluído com sucesso' })
  async delete(@ActiveCompany() company: any, @Param('id') docId: string) {
    try {
      const result = await this.svc.deleteDocument(company.id, docId);
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
    @ActiveCompany() company: any,
    @Param('id') docId: string,
    @Body() dto: UploadDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('Arquivo é obrigatório');
    }
    return this.svc.reuploadDocument(company.id, docId, dto, file);
  }
}
