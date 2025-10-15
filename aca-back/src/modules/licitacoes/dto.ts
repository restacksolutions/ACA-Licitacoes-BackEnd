import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum LicStatus {
  draft = 'draft',
  open = 'open',
  closed = 'closed',
  cancelled = 'cancelled',
  awarded = 'awarded',
}

export class CreateLicitacaoDto {
  @ApiProperty({
    description: 'Título da licitação',
    example: 'Licitação para Serviços de TI',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Status da licitação',
    enum: LicStatus,
    example: LicStatus.draft,
  })
  @IsEnum(LicStatus)
  status: LicStatus;

  @ApiProperty({
    description: 'URL do edital (opcional)',
    example: 'https://example.com/edital.pdf',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  editalUrl?: string;

  @ApiProperty({
    description: 'Data da sessão de abertura',
    example: '2024-12-15T14:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  sessionDate?: string;

  @ApiProperty({
    description: 'Prazo para submissão de propostas',
    example: '2024-12-10T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  submissionDeadline?: string;
}

export class UpdateLicitacaoDto {
  @ApiProperty({
    description: 'Título da licitação',
    example: 'Licitação para Serviços de TI - Atualizada',
    required: false,
  })
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Status da licitação',
    enum: LicStatus,
    example: LicStatus.open,
    required: false,
  })
  @IsOptional()
  @IsEnum(LicStatus)
  status?: LicStatus;

  @ApiProperty({
    description: 'URL do edital',
    example: 'https://example.com/edital-atualizado.pdf',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  editalUrl?: string;

  @ApiProperty({
    description: 'Data da sessão de abertura',
    example: '2024-12-20T14:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  sessionDate?: string;

  @ApiProperty({
    description: 'Prazo para submissão de propostas',
    example: '2024-12-15T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  submissionDeadline?: string;
}

export class CreateLicDocDto {
  @ApiProperty({
    description: 'Nome do documento',
    example: 'Proposta Técnica',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Tipo do documento',
    example: 'proposta',
    required: false,
  })
  @IsOptional()
  docType?: string;

  @ApiProperty({
    description: 'Se o documento é obrigatório',
    example: true,
    required: false,
  })
  @IsOptional()
  required?: boolean;

  @ApiProperty({
    description: 'Se o documento foi entregue',
    example: false,
    required: false,
  })
  @IsOptional()
  submitted?: boolean;

  @ApiProperty({
    description: 'Se o documento foi assinado',
    example: false,
    required: false,
  })
  @IsOptional()
  signed?: boolean;

  @ApiProperty({
    description: 'Data de emissão do documento',
    example: '2024-01-15T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiProperty({
    description: 'Data de expiração do documento',
    example: '2024-12-31T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiProperty({
    description: 'Observações sobre o documento',
    example: 'Documento obrigatório para participação na licitação',
    required: false,
  })
  @IsOptional()
  notes?: string;
}

export class UpdateLicDocDto extends CreateLicDocDto {}

export class CreateLicEventDto {
  @ApiProperty({
    description: 'Tipo do evento',
    example: 'status_changed',
    enum: ['status_changed', 'note', 'deadline_update', 'document_added'],
  })
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Dados do evento (JSON)',
    example: {
      from: 'draft',
      to: 'open',
      reason: 'Licitação publicada',
    },
  })
  @IsNotEmpty()
  payload: any;
}
