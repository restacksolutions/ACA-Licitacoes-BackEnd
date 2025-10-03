import { Body, Controller, Get, Param, Patch, Post, Delete, UseGuards, NotFoundException, Query, UploadedFile, UseInterceptors, Res, Header } from '@nestjs/common';
import type { Response } from 'express';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../core/security/jwt-auth.guard';
import { CompanyGuard } from '../../core/tenancy/company.guard';
import { RolesGuard } from '../../core/security/roles.guard';
import { Roles } from '../../core/security/roles.decorator';
import { CurrentUser } from '../../core/security/current-user.decorator';
import { CurrentCompany } from '../../core/tenancy/current-company.decorator';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto, CompanyResponseDto } from './dto/company.dto';
import { UserHelper } from '../../core/security/user-helper.service';
import { DocumentsService } from '../documents/documents.service';
import { DocumentListQueryDto, UploadDocumentDto, UpdateCompanyDocDto } from '../documents/dto/document.dto';

@ApiTags('Companies')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly svc: CompaniesService,
    private readonly userHelper: UserHelper,
    private readonly documentsService: DocumentsService,
  ) {}

  @Get()
  async myCompanies(@CurrentUser() user: { authUserId: string }) {
    return this.svc.myCompanies(user.authUserId);
  }

  @Post()
  async create(@Body() dto: CreateCompanyDto, @CurrentUser() user: { authUserId: string }) {
    const userId = await this.userHelper.internalUserId(user.authUserId);
    if (!userId) throw new NotFoundException('Usuário não encontrado no sistema');
    return this.svc.create(dto, userId);
  }

  @UseGuards(CompanyGuard)
  @Get(':companyId')
  async get(@Param('companyId') companyId: string, @CurrentCompany() _ctx: string) {
    return this.svc.getById(companyId);
  }

  @UseGuards(CompanyGuard, RolesGuard)
  @Roles('owner','admin')
  @Patch(':companyId')
  async update(@Param('companyId') companyId: string, @Body() dto: UpdateCompanyDto) {
    console.log('[CompaniesController.update] ===== ATUALIZANDO EMPRESA =====');
    console.log('[CompaniesController.update] CompanyId recebido:', companyId);
    console.log('[CompaniesController.update] Tipo do companyId:', typeof companyId);
    console.log('[CompaniesController.update] DTO recebido:', dto);
    console.log('[CompaniesController.update] Chaves do DTO:', Object.keys(dto));
    console.log('[CompaniesController.update] Chamando svc.update...');
    
    const result = await this.svc.update(companyId, dto);
    
    console.log('[CompaniesController.update] Resultado do svc.update:', result);
    console.log('[CompaniesController.update] ===== ATUALIZAÇÃO CONCLUÍDA =====');
    
    return result;
  }

  @UseGuards(CompanyGuard)
  @Get(':companyId/documents')
  async getDocuments(@Param('companyId') companyId: string, @Query() query: DocumentListQueryDto) {
    return this.documentsService.findAll(companyId, query.page, query.limit, query.search);
  }

  @UseGuards(CompanyGuard)
  @Post(':companyId/documents/upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Param('companyId') companyId: string,
    @Body() dto: UploadDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('Arquivo é obrigatório');
    }
    return this.documentsService.upload(companyId, dto, file);
  }

  @UseGuards(CompanyGuard)
  @Post(':companyId/documents/:documentId/reupload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async reuploadDocument(
    @Param('companyId') companyId: string,
    @Param('documentId') documentId: string,
    @Body() dto: UploadDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('Arquivo é obrigatório');
    }
    return this.documentsService.reuploadDocument(companyId, documentId, dto, file);
  }

  @UseGuards(CompanyGuard)
  @Get(':companyId/documents/:documentId/content')
  @ApiOperation({ summary: 'Download do conteúdo do documento' })
  @ApiResponse({ status: 200, description: 'Conteúdo do documento' })
  @Header('Cache-Control', 'public, max-age=3600')
  async getDocumentContent(
    @Param('companyId') companyId: string,
    @Param('documentId') documentId: string,
    @Res() res: Response,
  ) {
    const { fileName, content, mimeType } = await this.documentsService.getDocumentContent(companyId, documentId);
    
    res.set({
      'Content-Type': mimeType || 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': content.length.toString()
    });
    
    res.send(content);
  }

  @UseGuards(CompanyGuard)
  @Get(':companyId/documents/:documentId/meta')
  @ApiOperation({ summary: 'Obter metadados do documento' })
  @ApiResponse({ status: 200, description: 'Metadados do documento' })
  async getDocumentMeta(
    @Param('companyId') companyId: string,
    @Param('documentId') documentId: string,
  ) {
    return this.documentsService.getDocumentMeta(companyId, documentId);
  }

  @UseGuards(CompanyGuard)
  @Patch(':companyId/documents/:documentId')
  @ApiOperation({ summary: 'Atualizar documento' })
  @ApiResponse({ status: 200, description: 'Documento atualizado' })
  async updateDocument(
    @Param('companyId') companyId: string,
    @Param('documentId') documentId: string,
    @Body() dto: UpdateCompanyDocDto,
  ) {
    return this.documentsService.updateDocument(companyId, documentId, dto);
  }

  @UseGuards(CompanyGuard)
  @Delete(':companyId/documents/:documentId')
  @ApiOperation({ summary: 'Excluir documento' })
  @ApiResponse({ status: 200, description: 'Documento excluído' })
  async deleteDocument(
    @Param('companyId') companyId: string,
    @Param('documentId') documentId: string,
  ) {
    return this.documentsService.deleteDocument(companyId, documentId);
  }
}
