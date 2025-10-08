import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Empresa ABC Ltda',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'CNPJ da empresa',
    example: '12.345.678/0001-90',
  })
  @IsNotEmpty()
  cnpj: string;
}

export class UpdateCompanyDto {
  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Empresa ABC Ltda',
    required: false,
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'CNPJ da empresa',
    example: '12.345.678/0001-90',
    required: false,
  })
  @IsOptional()
  cnpj?: string; // manteremos editável no MVP; pode ser travado em prod
}
