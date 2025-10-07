import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum LicitacaoStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
  AWARDED = 'AWARDED'
}

export class CreateLicitacaoDto {
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

  @ApiPropertyOptional({ enum: LicitacaoStatus, example: LicitacaoStatus.DRAFT })
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

export class UpdateLicitacaoDto {
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

  @ApiPropertyOptional({ enum: LicitacaoStatus, example: LicitacaoStatus.OPEN })
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

export class LicitacaoResponseDto {
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

  @ApiProperty({ enum: LicitacaoStatus, example: LicitacaoStatus.DRAFT })
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

export class LicitacaoListQueryDto {
  @ApiPropertyOptional({ 
    enum: LicitacaoStatus,
    example: LicitacaoStatus.DRAFT,
    description: 'Filtrar por status da licitação'
  })
  @IsEnum(LicitacaoStatus)
  @IsOptional()
  status?: LicitacaoStatus;

  @ApiPropertyOptional({ 
    example: 'equipamentos',
    description: 'Buscar por título, órgão, modalidade ou observações'
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  pageSize?: number = 10;
}

export class AnalisarEditalDto {
  @ApiPropertyOptional({ 
    example: 'Análise com foco em documentos de veículos',
    description: 'Observações adicionais para a análise'
  })
  @IsString()
  @IsOptional()
  observacoes?: string;

  @ApiPropertyOptional({ 
    example: true,
    description: 'Se deve incluir sugestões de veículos na análise'
  })
  @IsOptional()
  incluirSugestoesVeiculos?: boolean;
}

export class ConformidadeResponseDto {
  @ApiProperty({ example: 5, description: 'Total de documentos requeridos' })
  totalRequired!: number;

  @ApiProperty({ example: 3, description: 'Total de documentos submetidos' })
  totalSubmitted!: number;

  @ApiProperty({ example: 2, description: 'Total de documentos assinados' })
  totalSigned!: number;

  @ApiProperty({ example: 60.0, description: 'Percentual de cobertura de documentos' })
  coberturaPercentual!: number;

  @ApiProperty({ example: 66.67, description: 'Percentual de assinatura de documentos' })
  assinaturaPercentual!: number;

  @ApiProperty({ 
    description: 'Lista de documentos pendentes',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        docType: { type: 'string', example: 'CRLV' },
        required: { type: 'boolean', example: true },
        submitted: { type: 'boolean', example: false },
        signed: { type: 'boolean', example: false },
      }
    }
  })
  pendentes!: Array<{
    docType: string;
    required: boolean;
    submitted: boolean;
    signed: boolean;
  }>;

  @ApiProperty({ 
    description: 'Lista completa de documentos da licitação',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        docType: { type: 'string' },
        required: { type: 'boolean' },
        submitted: { type: 'boolean' },
        signed: { type: 'boolean' },
        issueDate: { type: 'string', format: 'date' },
        expiresAt: { type: 'string', format: 'date' },
        version: { type: 'number' },
        notes: { type: 'string' },
      }
    }
  })
  documents!: Array<{
    id: string;
    docType: string;
    required: boolean;
    submitted: boolean;
    signed: boolean;
    issueDate?: string;
    expiresAt?: string;
    version: number;
    notes?: string;
  }>;
}
