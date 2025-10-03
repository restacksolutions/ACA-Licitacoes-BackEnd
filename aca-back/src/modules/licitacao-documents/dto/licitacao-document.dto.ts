import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsDateString, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { LicitacaoDocType } from '@prisma/client';

export class CreateLicitacaoDocumentDto {
  @ApiProperty({ enum: LicitacaoDocType, example: 'proposta' })
  @IsEnum(LicitacaoDocType)
  docType!: LicitacaoDocType;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({ example: 'Documento obrigatório' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateLicitacaoDocumentDto {
  @ApiPropertyOptional({ enum: LicitacaoDocType })
  @IsOptional()
  @IsEnum(LicitacaoDocType)
  docType?: LicitacaoDocType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UploadLicitacaoDocumentDto {
  @ApiProperty({ enum: LicitacaoDocType, example: 'proposta' })
  @IsEnum(LicitacaoDocType)
  docType!: LicitacaoDocType;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({ example: 'Documento obrigatório' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class LicitacaoDocumentListQueryDto {
  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}