import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyDocDto {
  @ApiProperty({
    description: 'ID da empresa (obrigatório)',
    example: 'da6cc36e-b112-4301-ae6d-f824ccf944ad',
  })
  @IsNotEmpty()
  company_id: string;

  @ApiProperty({
    description: 'Nome do cliente ou empresa',
    example: 'Empresa ABC Ltda',
    minLength: 1,
  })
  @IsNotEmpty()
  clientName: string;

  @ApiProperty({
    description: 'Tipo do documento',
    example: 'Contrato de Prestação de Serviços',
    minLength: 1,
  })
  @IsNotEmpty()
  docType: string;

  @ApiPropertyOptional({
    description: 'Data de emissão do documento',
    example: '2024-01-15T00:00:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional({
    description: 'Data de expiração do documento',
    example: '2024-12-31T23:59:59.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({
    description: 'Observações adicionais sobre o documento',
    example: 'Contrato de prestação de serviços de consultoria',
    maxLength: 1000,
  })
  @IsOptional()
  notes?: string;
}

export class UpdateCompanyDocDto {
  @ApiPropertyOptional({
    description: 'Nome do cliente ou empresa',
    example: 'Empresa ABC Ltda - Atualizada',
    minLength: 1,
  })
  @IsOptional()
  clientName?: string;

  @ApiPropertyOptional({
    description: 'Tipo do documento',
    example: 'Contrato de Prestação de Serviços',
    minLength: 1,
  })
  @IsOptional()
  docType?: string;

  @ApiPropertyOptional({
    description: 'Data de emissão do documento',
    example: '2024-01-15T00:00:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional({
    description: 'Data de expiração do documento',
    example: '2024-12-31T23:59:59.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({
    description: 'Observações adicionais sobre o documento',
    example: 'Contrato atualizado com novas cláusulas',
    maxLength: 1000,
  })
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Versão do documento (gerenciada automaticamente)',
    example: 2,
    minimum: 1,
  })
  @IsOptional()
  version?: number;
}
