import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCompanyDocDto {
  @ApiProperty({ 
    example: 'cnpj',
    description: 'Tipo do documento. Valores aceitos: cnpj, certidao, procuracao, inscricao_estadual, outro'
  })
  @IsIn(['cnpj', 'certidao', 'procuracao', 'inscricao_estadual', 'outro'], {
    message: 'docType deve ser um dos seguintes valores: cnpj, certidao, procuracao, inscricao_estadual, outro'
  })
  docType!: string;

  @ApiPropertyOptional({ example: '12345678901234' })
  @IsOptional()
  @IsString()
  docNumber?: string;

  @ApiPropertyOptional({ example: 'Receita Federal' })
  @IsOptional()
  @IsString()
  issuer?: string;

  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({ example: 'Documento em bom estado' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateCompanyDocDto {
  @ApiPropertyOptional({ 
    example: 'cnpj',
    description: 'Tipo do documento. Valores aceitos: cnpj, certidao, procuracao, inscricao_estadual, outro'
  })
  @IsOptional()
  @IsIn(['cnpj', 'certidao', 'procuracao', 'inscricao_estadual', 'outro'], {
    message: 'docType deve ser um dos seguintes valores: cnpj, certidao, procuracao, inscricao_estadual, outro'
  })
  docType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  docNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  issuer?: string;

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

export class UploadDocumentDto {
  @ApiProperty({ 
    example: 'cnpj',
    description: 'Tipo do documento. Valores aceitos: cnpj, certidao, procuracao, inscricao_estadual, outro'
  })
  @IsIn(['cnpj', 'certidao', 'procuracao', 'inscricao_estadual', 'outro'], {
    message: 'docType deve ser um dos seguintes valores: cnpj, certidao, procuracao, inscricao_estadual, outro'
  })
  docType!: string;

  @ApiPropertyOptional({ 
    example: '12345678901234',
    description: 'Número do documento'
  })
  @IsOptional()
  @IsString()
  docNumber?: string;

  @ApiPropertyOptional({ 
    example: 'Receita Federal',
    description: 'Órgão emissor do documento'
  })
  @IsOptional()
  @IsString()
  issuer?: string;

  @ApiPropertyOptional({ 
    example: '2025-01-01',
    description: 'Data de emissão do documento (formato YYYY-MM-DD)'
  })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional({ 
    example: '2026-01-01',
    description: 'Data de vencimento do documento (formato YYYY-MM-DD)'
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({ 
    example: 'Documento em bom estado',
    description: 'Observações sobre o documento'
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ 
    example: 'Barigui',
    description: 'Nome do cliente (opcional)'
  })
  @IsOptional()
  @IsString()
  clientName?: string;
}

export class DocumentListQueryDto {
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

  @ApiPropertyOptional({ example: 'CNPJ' })
  @IsOptional()
  @IsString()
  search?: string;
}