import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { CompanyGuard } from '../../common/guards/company.guard';
import { PrismaService } from '../../common/utils/prisma.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { sha256 } from '../../common/utils/hash.utils';
import type { Response } from 'express';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  companyId: string;
}

const MAX_BYTES = Number(process.env.UPLOAD_MAX_BYTES || 10 * 1024 * 1024);
const ALLOWED = (
  process.env.UPLOAD_ALLOWED_MIME ||
  'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
)
  .split(',')
  .map((s) => s.trim());

@ApiTags('Licitações - Upload')
@ApiBearerAuth('access')
@ApiBearerAuth('company-id')
@Controller('licitacoes')
@UseGuards(JwtAccessGuard, CompanyGuard)
export class LicitacoesUploadController {
  constructor(private prisma: PrismaService) {}

  // Upload de arquivo para um documento da licitação (multipart)
  @Post(':id/documents/:docId/upload')
  @ApiOperation({ summary: 'Upload de arquivo para documento da licitação' })
  @ApiParam({ name: 'id', description: 'ID da licitação' })
  @ApiParam({ name: 'docId', description: 'ID do documento' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo para upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo para upload (PDF, DOC, DOCX)',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Arquivo enviado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'doc-123e4567-e89b-12d3-a456-426614174000',
        },
        name: { type: 'string', example: 'Proposta Técnica' },
        fileName: { type: 'string', example: 'proposta_tecnica.pdf' },
        fileMime: { type: 'string', example: 'application/pdf' },
        fileSize: { type: 'number', example: 245760 },
        fileSha256: { type: 'string', example: 'a1b2c3d4e5f6789...' },
        submitted: { type: 'boolean', example: true },
        licitacaoId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        updatedAt: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Arquivo inválido ou muito grande' })
  @ApiResponse({
    status: 404,
    description: 'Licitação ou documento não encontrado',
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 403, description: 'Sem permissão para a empresa' })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('docId') docId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('file is required');
    if (!ALLOWED.includes(file.mimetype))
      throw new BadRequestException('MIME not allowed');
    if (file.size > MAX_BYTES)
      throw new BadRequestException(`File too large (max ${MAX_BYTES} bytes)`);

    // valida escopo da licitação
    const lic = await this.prisma.licitacao.findFirst({
      where: { id, companyId: req.companyId },
    });
    if (!lic) throw new BadRequestException('Licitacao not found');

    const doc = await this.prisma.licitacaoDocument.findFirst({
      where: { id: docId, licitacaoId: id },
    });
    if (!doc) throw new BadRequestException('Document not found');

    return this.prisma.licitacaoDocument.update({
      where: { id: docId },
      data: {
        fileName: file.originalname,
        fileMime: file.mimetype,
        fileSize: file.size,
        fileSha256: sha256(file.buffer),
        fileData: file.buffer,
        submitted: true, // marcou como entregue ao anexar
      },
    });
  }

  // Download do arquivo do documento
  @Get(':id/documents/:docId/file')
  @ApiOperation({ summary: 'Download de arquivo do documento da licitação' })
  @ApiParam({ name: 'id', description: 'ID da licitação' })
  @ApiParam({ name: 'docId', description: 'ID do documento' })
  @ApiResponse({ status: 200, description: 'Arquivo baixado com sucesso' })
  @ApiResponse({ status: 404, description: 'Arquivo não encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 403, description: 'Sem permissão para a empresa' })
  async download(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('docId') docId: string,
    @Res() res: Response,
  ) {
    const lic = await this.prisma.licitacao.findFirst({
      where: { id, companyId: req.companyId },
    });
    if (!lic) throw new BadRequestException('Licitacao not found');

    const doc = await this.prisma.licitacaoDocument.findFirst({
      where: { id: docId, licitacaoId: id },
    });
    if (!doc || !doc.fileData) throw new BadRequestException('File not found');

    res.setHeader('Content-Type', doc.fileMime!);
    res.setHeader('Content-Length', String(doc.fileSize!));
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(doc.fileName!)}"`,
    );
    return res.send(Buffer.from(doc.fileData as any));
  }
}
