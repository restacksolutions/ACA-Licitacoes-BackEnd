import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString, IsDateString } from 'class-validator';

export enum LicitacaoStatus {
  draft = 'draft',
  open = 'open',
  closed = 'closed',
  cancelled = 'cancelled',
  awarded = 'awarded'
}

export class CreateBidDto {
  @ApiProperty({ example: 'Licitação para Fornecimento de Equipamentos' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: 'Prefeitura Municipal de São Paulo' })
  @IsString()
  @IsOptional()
  orgao?: string;

  @ApiPropertyOptional({ example: 'Pregão Eletrônico' })
  @IsString()
  @IsOptional()
  modalidade?: string;

  @ApiPropertyOptional({ example: 'https://example.com/edital.pdf' })
  @IsString()
  @IsOptional()
  editalUrl?: string;

  @ApiPropertyOptional({ example: '2025-10-15T14:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  sessionAt?: string;

  @ApiPropertyOptional({ example: '2025-10-10T18:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  submissionDeadline?: string;

  @ApiPropertyOptional({ enum: LicitacaoStatus, example: LicitacaoStatus.draft })
  @IsEnum(LicitacaoStatus)
  @IsOptional()
  status?: LicitacaoStatus;

  @ApiPropertyOptional({ example: '150000.50' })
  @IsNumberString()
  @IsOptional()
  saleValue?: string;

  @ApiPropertyOptional({ example: 'Observações importantes sobre a licitação' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateBidDto {
  @ApiPropertyOptional({ example: 'Licitação para Fornecimento de Equipamentos' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Prefeitura Municipal de São Paulo' })
  @IsString()
  @IsOptional()
  orgao?: string;

  @ApiPropertyOptional({ example: 'Pregão Eletrônico' })
  @IsString()
  @IsOptional()
  modalidade?: string;

  @ApiPropertyOptional({ example: 'https://example.com/edital.pdf' })
  @IsString()
  @IsOptional()
  editalUrl?: string;

  @ApiPropertyOptional({ example: '2025-10-15T14:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  sessionAt?: string;

  @ApiPropertyOptional({ example: '2025-10-10T18:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  submissionDeadline?: string;

  @ApiPropertyOptional({ enum: LicitacaoStatus, example: LicitacaoStatus.open })
  @IsEnum(LicitacaoStatus)
  @IsOptional()
  status?: LicitacaoStatus;

  @ApiPropertyOptional({ example: '150000.50' })
  @IsNumberString()
  @IsOptional()
  saleValue?: string;

  @ApiPropertyOptional({ example: 'Observações importantes sobre a licitação' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class BidResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 'Licitação para Fornecimento de Equipamentos' })
  title!: string;

  @ApiPropertyOptional({ example: 'Prefeitura Municipal de São Paulo' })
  orgao?: string;

  @ApiPropertyOptional({ example: 'Pregão Eletrônico' })
  modalidade?: string;

  @ApiPropertyOptional({ example: 'https://example.com/edital.pdf' })
  editalUrl?: string;

  @ApiPropertyOptional({ example: '2025-10-15T14:00:00.000Z' })
  sessionAt?: string;

  @ApiPropertyOptional({ example: '2025-10-10T18:00:00.000Z' })
  submissionDeadline?: string;

  @ApiProperty({ enum: LicitacaoStatus, example: LicitacaoStatus.draft })
  status!: LicitacaoStatus;

  @ApiPropertyOptional({ example: '150000.50' })
  saleValue?: string;

  @ApiPropertyOptional({ example: 'Observações importantes sobre a licitação' })
  notes?: string;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  updatedAt!: string;
}