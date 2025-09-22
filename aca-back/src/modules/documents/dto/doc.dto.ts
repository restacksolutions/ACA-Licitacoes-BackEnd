import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDocDto {
  @ApiProperty({ example: 'CNPJ' })
  @IsString()
  docType!: string;

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

  @ApiPropertyOptional({ example: 'Documento em bom estado' })
  notes?: string;

  @ApiProperty({ example: 1 })
  version!: number;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  updatedAt!: string;
}