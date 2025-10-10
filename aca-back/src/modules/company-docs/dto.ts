import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyDocDto {
  @ApiProperty({
    description: 'Nome do cliente/empresa do documento',
    example: 'Acme Ltda',
  })
  @IsNotEmpty()
  @IsString()
  clientName: string;

  @ApiProperty({
    description: 'Tipo do documento',
    example: 'Certidão Negativa',
  })
  @IsNotEmpty()
  @IsString()
  docType: string;

  @ApiProperty({
    description: 'Nome do arquivo',
    example: 'certidao-negativa.pdf',
  })
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty({
    description: 'Tipo MIME do arquivo',
    example: 'application/pdf',
  })
  @IsNotEmpty()
  @IsString()
  fileMime: string;

  @ApiProperty({
    description: 'Tamanho do arquivo em bytes',
    example: 1024000,
  })
  @IsNotEmpty()
  @IsNumber()
  fileSize: number;

  @ApiProperty({
    description: 'Hash SHA256 do arquivo',
    example: 'a1b2c3d4e5f6...',
  })
  @IsNotEmpty()
  @IsString()
  fileSha256: string;

  @ApiProperty({
    description: 'Dados binários do arquivo',
    type: 'string',
    format: 'binary',
  })
  @IsNotEmpty()
  fileData: Buffer;

  @ApiPropertyOptional({
    description: 'Data de emissão do documento',
    example: '2025-10-07',
  })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional({
    description: 'Data de expiração do documento',
    example: '2026-10-07',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({
    description: 'Observações adicionais',
    example: 'Documento renovado em 2025',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateCompanyDocDto {
  @ApiPropertyOptional({
    description: 'Nome do cliente/empresa do documento',
    example: 'Acme Ltda',
  })
  @IsOptional()
  @IsString()
  clientName?: string;

  @ApiPropertyOptional({
    description: 'Tipo do documento',
    example: 'Certidão Negativa',
  })
  @IsOptional()
  @IsString()
  docType?: string;

  @ApiPropertyOptional({
    description: 'Nome do arquivo',
    example: 'certidao-negativa-v2.pdf',
  })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiPropertyOptional({
    description: 'Tipo MIME do arquivo',
    example: 'application/pdf',
  })
  @IsOptional()
  @IsString()
  fileMime?: string;

  @ApiPropertyOptional({
    description: 'Tamanho do arquivo em bytes',
    example: 1024000,
  })
  @IsOptional()
  @IsNumber()
  fileSize?: number;

  @ApiPropertyOptional({
    description: 'Hash SHA256 do arquivo',
    example: 'a1b2c3d4e5f6...',
  })
  @IsOptional()
  @IsString()
  fileSha256?: string;

  @ApiPropertyOptional({
    description: 'Dados binários do arquivo',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  fileData?: Buffer;

  @ApiPropertyOptional({
    description: 'Data de emissão do documento',
    example: '2025-10-07',
  })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional({
    description: 'Data de expiração do documento',
    example: '2026-10-07',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({
    description: 'Observações adicionais',
    example: 'Documento renovado em 2025',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description:
      'Versão do documento (incrementa automaticamente ao trocar arquivo)',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  version?: number;
}
