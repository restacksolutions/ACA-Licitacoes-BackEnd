import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCompanyDocDto {
  @ApiProperty({ example: 'CNPJ' })
  @IsString()
  docType!: string;

  @ApiProperty({ example: 'Cliente ABC Ltda' })
  @IsString()
  clientName!: string;

  @ApiPropertyOptional({ example: '12.345.678/0001-90' })
  @IsString()
  @IsOptional()
  docNumber?: string;

  @ApiPropertyOptional({ example: 'Receita Federal' })
  @IsString()
  @IsOptional()
  issuer?: string;

  @ApiPropertyOptional({ example: '2020-01-15' })
  @IsDateString()
  @IsOptional()
  issueDate?: string;

  @ApiPropertyOptional({ example: '2030-01-15' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @ApiPropertyOptional({ example: 'Documento em bom estado' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateCompanyDocDto {
  @ApiPropertyOptional({ example: 'CNPJ' })
  @IsString()
  @IsOptional()
  docType?: string;

  @ApiPropertyOptional({ example: 'Cliente ABC Ltda' })
  @IsString()
  @IsOptional()
  clientName?: string;

  @ApiPropertyOptional({ example: '12.345.678/0001-90' })
  @IsString()
  @IsOptional()
  docNumber?: string;

  @ApiPropertyOptional({ example: 'Receita Federal' })
  @IsString()
  @IsOptional()
  issuer?: string;

  @ApiPropertyOptional({ example: '2020-01-15' })
  @IsDateString()
  @IsOptional()
  issueDate?: string;

  @ApiPropertyOptional({ example: '2030-01-15' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @ApiPropertyOptional({ example: 'Documento em bom estado' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CompanyDocResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 'CNPJ' })
  docType!: string;

  @ApiProperty({ example: 'Cliente ABC Ltda' })
  clientName!: string;

  @ApiPropertyOptional({ example: '12.345.678/0001-90' })
  docNumber?: string;

  @ApiPropertyOptional({ example: 'Receita Federal' })
  issuer?: string;

  @ApiPropertyOptional({ example: '2020-01-15' })
  issueDate?: string;

  @ApiPropertyOptional({ example: '2030-01-15' })
  expiresAt?: string;

  @ApiPropertyOptional({ example: 'https://storage.com/document.pdf' })
  filePath?: string;

  @ApiPropertyOptional({ example: 'application/pdf' })
  mimeType?: string;

  @ApiPropertyOptional({ example: 1048576 })
  fileSize?: number;

  @ApiPropertyOptional({ example: 'a1b2c3d4e5f6...' })
  sha256Hex?: string;

  @ApiPropertyOptional({ example: 'Documento em bom estado' })
  notes?: string;

  @ApiProperty({ example: 1 })
  version!: number;

  @ApiProperty({ 
    example: 'Válido',
    enum: ['Válido', 'À vencer', 'Expirado', 'Sem validade'],
    description: 'Status calculado do documento'
  })
  status!: string;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  updatedAt!: string;
}

export class UploadDocumentDto {
  @ApiProperty({ example: 'CNPJ' })
  @IsString()
  docType!: string;

  @ApiProperty({ example: 'Cliente ABC Ltda' })
  @IsString()
  clientName!: string;

  @ApiPropertyOptional({ example: '12.345.678/0001-90' })
  @IsString()
  @IsOptional()
  docNumber?: string;

  @ApiPropertyOptional({ example: 'Receita Federal' })
  @IsString()
  @IsOptional()
  issuer?: string;

  @ApiPropertyOptional({ example: '2020-01-15' })
  @IsDateString()
  @IsOptional()
  issueDate?: string;

  @ApiPropertyOptional({ example: '2030-01-15' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @ApiPropertyOptional({ example: 'Documento em bom estado' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class DocumentListQueryDto {
  @ApiPropertyOptional({ example: 'CNPJ' })
  @IsString()
  @IsOptional()
  docType?: string;

  @ApiPropertyOptional({ 
    example: 'Válido',
    enum: ['Válido', 'À vencer', 'Expirado', 'Sem validade'],
    description: 'Filtrar por status do documento'
  })
  @IsString()
  @IsOptional()
  status?: 'Válido' | 'À vencer' | 'Expirado' | 'Sem validade';

  @ApiPropertyOptional({ 
    example: '12345678',
    description: 'Buscar por número do documento, emissor ou observações'
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  pageSize?: number = 10;
}