import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../core/security/jwt-auth.guard';
import { CompanyGuard } from '../../core/tenancy/company.guard';
import { CreateCompanyDocDto, UpdateCompanyDocDto, CompanyDocResponseDto } from './dto/doc.dto';
import { DocumentsService } from './documents.service';

@ApiTags('Company Documents')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, CompanyGuard)
@Controller('companies/:companyId/documents')
export class DocumentsController {
  constructor(private readonly svc: DocumentsService) {}

  @Get()
  list(@Param('companyId') companyId: string) {
    return this.svc.list(companyId);
  }

  @Post()
  create(@Param('companyId') companyId: string, @Body() dto: CreateCompanyDocDto) {
    return this.svc.create(companyId, dto);
  }

  @Post(':docId/upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Param('companyId') companyId: string,
    @Param('docId') docId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.svc.upload(companyId, docId, file.buffer, file.mimetype);
  }
}
