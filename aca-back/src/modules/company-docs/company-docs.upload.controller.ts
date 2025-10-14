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
  ApiHeader,
} from '@nestjs/swagger';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { CompanyGuard } from '../../common/guards/company.guard';
import { PrismaService } from '../../common/utils/prisma.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { sha256 } from '../../common/utils/hash.utils';
import type { Response, Request } from 'express';

interface AuthenticatedRequest extends Request {
  companyId: string;
}

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

const MAX_BYTES = Number(process.env.UPLOAD_MAX_BYTES || 10 * 1024 * 1024);
const ALLOWED = (
  process.env.UPLOAD_ALLOWED_MIME ||
  'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
)
  .split(',')
  .map((s) => s.trim());

@ApiTags('company-docs')
@Controller('company-docs')
@UseGuards(JwtAccessGuard, CompanyGuard)
@ApiBearerAuth('access')
@ApiHeader({
  name: 'X-Company-Id',
  description: 'ID da empresa (obrigatório para upload)',
  required: true,
  example: 'da6cc36e-b112-4301-ae6d-f824ccf944ad',
})
export class CompanyDocsUploadController {
  constructor(private prisma: PrismaService) {}

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload de arquivo para documento',
    description:
      'Faz upload de um arquivo para um documento existente. Suporta PDF, Word e outros formatos. O header X-Company-Id é obrigatório.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do documento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo a ser enviado',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo do documento (PDF, Word, etc.)',
        },
      },
      required: ['file'],
    },
    examples: {
      'Upload PDF': {
        summary: 'Upload de arquivo PDF',
        description:
          'Exemplo de upload de arquivo PDF. Use o header X-Company-Id.',
        value: {
          file: '[Selecione um arquivo PDF]',
        },
      },
      'Upload Word': {
        summary: 'Upload de arquivo Word',
        description:
          'Exemplo de upload de arquivo Word. Use o header X-Company-Id.',
        value: {
          file: '[Selecione um arquivo Word]',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Arquivo enviado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        fileName: 'contrato_abc_2024.pdf',
        fileMime: 'application/pdf',
        fileSize: 245760,
        fileSha256: 'a1b2c3d4e5f6...',
        version: 2,
        updatedAt: '2024-01-20T14:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Arquivo inválido ou muito grande' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  @ApiResponse({ status: 401, description: 'Token de acesso inválido' })
  async upload(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @UploadedFile() file: MulterFile | undefined,
  ) {
    if (!file) throw new BadRequestException('file is required');
    if (!ALLOWED.includes(file.mimetype))
      throw new BadRequestException('MIME not allowed');
    if (file.size > MAX_BYTES)
      throw new BadRequestException(`File too large (max ${MAX_BYTES} bytes)`);

    const doc = await this.prisma.companyDocument.findFirst({
      where: { id, companyId: req.companyId },
    });
    if (!doc) throw new BadRequestException('Document not found');

    const updatedDoc = await this.prisma.companyDocument.update({
      where: { id },
      data: {
        fileName: file.originalname,
        fileMime: file.mimetype,
        fileSize: file.size,
        fileSha256: sha256(file.buffer),
        fileData: file.buffer,
        version: (doc.version ?? 1) + 1,
      },
    });

    // Remove o campo fileData da resposta
    const { fileData: _, ...docWithoutFileData } = updatedDoc;
    return docWithoutFileData;
  }

  @Get(':id/file')
  @ApiOperation({
    summary: 'Download de arquivo do documento',
    description: 'Baixa o arquivo associado a um documento específico.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do documento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Arquivo baixado com sucesso',
    content: {
      'application/pdf': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
      'application/msword': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
    },
  })
  @ApiResponse({ status: 404, description: 'Documento não encontrado' })
  @ApiResponse({ status: 401, description: 'Token de acesso inválido' })
  async download(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const doc = await this.prisma.companyDocument.findFirst({
      where: { id, companyId: req.companyId },
    });
    if (!doc) throw new BadRequestException('Document not found');
    res.setHeader('Content-Type', doc.fileMime);
    res.setHeader('Content-Length', String(doc.fileSize));
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(doc.fileName)}"`,
    );
    return res.send(Buffer.from(doc.fileData as Buffer));
  }
}
