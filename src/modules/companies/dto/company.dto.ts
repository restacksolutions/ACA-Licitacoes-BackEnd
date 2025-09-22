import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateCompanyDto {
  @ApiPropertyOptional({ example: 'Empresa Atualizada' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '11.222.333/0001-44' })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiPropertyOptional({ example: '(11) 99999-9999' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Rua das Flores, 123' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class CompanyResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 'Empresa da Alice' })
  name!: string;

  @ApiPropertyOptional({ example: '00.000.000/0001-00' })
  cnpj?: string;

  @ApiPropertyOptional({ example: '(11) 99999-9999' })
  phone?: string;

  @ApiPropertyOptional({ example: 'Rua das Flores, 123' })
  address?: string;

  @ApiPropertyOptional({ example: 'path/to/logo.png' })
  logoPath?: string;

  @ApiPropertyOptional({ example: 'path/to/letterhead.png' })
  letterheadPath?: string;

  @ApiProperty({ example: true })
  active!: boolean;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  updatedAt!: string;
}
