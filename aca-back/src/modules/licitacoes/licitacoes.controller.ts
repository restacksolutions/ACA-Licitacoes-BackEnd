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
import { LicitacoesService } from './licitacoes.service';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { CompanyGuard } from '../../common/guards/company.guard';
import {
  CreateLicitacaoDto,
  UpdateLicitacaoDto,
  CreateLicDocDto,
  UpdateLicDocDto,
  CreateLicEventDto,
} from './dto';
import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
  companyId: string;
  user: { sub: string; email: string };
  membership?: { role: string; [key: string]: any };
}

@Controller('licitacoes')
@UseGuards(JwtAccessGuard, CompanyGuard)
export class LicitacoesController {
  constructor(private service: LicitacoesService) {}

  // CRUD licitações
  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateLicitacaoDto) {
    return this.service.create(req.companyId, dto);
  }

  @Get()
  list(
    @Req() req: AuthenticatedRequest,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.service.list(req.companyId, status, search);
  }

  @Get(':id')
  get(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.service.get(req.companyId, id);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateLicitacaoDto,
  ) {
    return this.service.update(req.companyId, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.service.remove(req.companyId, id);
  }

  // Documentos da licitação (metadados)
  @Get(':id/documents')
  listDocs(@Param('id') id: string) {
    return this.service.listDocs(id);
  }

  @Post(':id/documents')
  addDoc(@Param('id') id: string, @Body() dto: CreateLicDocDto) {
    return this.service.addDoc(id, dto);
  }

  @Patch(':id/documents/:docId')
  updateDoc(
    @Param('id') id: string,
    @Param('docId') docId: string,
    @Body() dto: UpdateLicDocDto,
  ) {
    return this.service.updateDoc(id, docId, dto);
  }

  @Delete(':id/documents/:docId')
  removeDoc(@Param('id') id: string, @Param('docId') docId: string) {
    return this.service.removeDoc(id, docId);
  }

  // Eventos
  @Get(':id/events')
  listEvents(@Param('id') id: string) {
    return this.service.listEvents(id);
  }

  @Post(':id/events')
  addEvent(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: CreateLicEventDto,
  ) {
    return this.service.addEvent(id, dto, req.user.sub);
  }

  // Summary
  @Get(':id/summary')
  summary(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.service.summary(req.companyId, id);
  }
}
