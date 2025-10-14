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
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { CompanyGuard } from '../../common/guards/company.guard';
import { PrismaService } from '../../common/utils/prisma.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { sha256 } from '../../common/utils/hash.utils';
import type { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  companyId: string;
  user: { sub: string; email: string };
  membership?: { role: string; [key: string]: any };
}

const MAX_BYTES = Number(process.env.UPLOAD_MAX_BYTES || 10 * 1024 * 1024);
const ALLOWED = (
  process.env.UPLOAD_ALLOWED_MIME ||
  'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
)
  .split(',')
  .map((s) => s.trim());

@Controller('licitacoes')
@UseGuards(JwtAccessGuard, CompanyGuard)
export class LicitacoesUploadController {
  constructor(private prisma: PrismaService) {}

  // Upload de arquivo para um documento da licitação (multipart)
  @Post(':id/documents/:docId/upload')
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
