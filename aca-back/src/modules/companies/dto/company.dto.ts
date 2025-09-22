import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, Length } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Empresa ABC Ltda' })
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiPropertyOptional({ example: '12.345.678/0001-90' })
  @IsString()
  @IsOptional()
  cnpj?: string;

  @ApiPropertyOptional({ example: '(11) 99999-9999' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Rua das Flores, 123 - São Paulo/SP' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'https://storage.com/logo.png' })
  @IsString()
  @IsOptional()
  logoPath?: string;

  @ApiPropertyOptional({ example: 'https://storage.com/letterhead.pdf' })
  @IsString()
  @IsOptional()
  letterheadPath?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class UpdateCompanyDto {
  @ApiPropertyOptional({ example: 'Empresa ABC Ltda' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '12.345.678/0001-90' })
  @IsString()
  @IsOptional()
  cnpj?: string;

  @ApiPropertyOptional({ example: '(11) 99999-9999' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Rua das Flores, 123 - São Paulo/SP' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'https://storage.com/logo.png' })
  @IsString()
  @IsOptional()
  logoPath?: string;

  @ApiPropertyOptional({ example: 'https://storage.com/letterhead.pdf' })
  @IsString()
  @IsOptional()
  letterheadPath?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class CompanyResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 'Empresa ABC Ltda' })
  name!: string;

  @ApiPropertyOptional({ example: '12.345.678/0001-90' })
  cnpj?: string;

  @ApiPropertyOptional({ example: '(11) 99999-9999' })
  phone?: string;

  @ApiPropertyOptional({ example: 'Rua das Flores, 123 - São Paulo/SP' })
  address?: string;

  @ApiPropertyOptional({ example: 'https://storage.com/logo.png' })
  logoPath?: string;

  @ApiPropertyOptional({ example: 'https://storage.com/letterhead.pdf' })
  letterheadPath?: string;

  @ApiProperty({ example: true })
  active!: boolean;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  updatedAt!: string;
}