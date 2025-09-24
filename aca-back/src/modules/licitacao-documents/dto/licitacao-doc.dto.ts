import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsNumber, Min, Max, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLicitacaoDocDto {
  @ApiProperty({ example: 'PROPOSTA_TECNICA' })
  @IsString()
  docType!: string;

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

  @ApiProperty({ example: true })
  @IsBoolean()
  required!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  submitted!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  signed!: boolean;
}

export class UpdateLicitacaoDocDto {
  @ApiPropertyOptional({ example: 'PROPOSTA_TECNICA' })
  @IsString()
  @IsOptional()
  docType?: string;

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

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  submitted?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  signed?: boolean;
}

export class LicitacaoDocResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 'PROPOSTA_TECNICA' })
  docType!: string;

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

  @ApiProperty({ example: true })
  required!: boolean;

  @ApiProperty({ example: false })
  submitted!: boolean;

  @ApiProperty({ example: false })
  signed!: boolean;

  @ApiProperty({ example: false })
  generatedFromTemplate!: boolean;

  @ApiProperty({ example: 1 })
  version!: number;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  updatedAt!: string;
}

export class UploadLicitacaoDocumentDto {
  @ApiProperty({ example: 'PROPOSTA_TECNICA' })
  @IsString()
  docType!: string;

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

  @ApiProperty({ example: true })
  @IsBoolean()
  required!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  submitted!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  signed!: boolean;
}

export class LicitacaoDocumentListQueryDto {
  @ApiPropertyOptional({ example: 'PROPOSTA_TECNICA' })
  @IsString()
  @IsOptional()
  docType?: string;

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
