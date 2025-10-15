// src/modules/auth/dto.ts
import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'john@acme.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8, example: 'Secret123!' })
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  fullName?: string;

  @ApiProperty({ example: 'Minha Empresa' })
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    example: '12345678000199',
    description: 'Somente dígitos (ou formate como preferir)',
  })
  @IsNotEmpty()
  cnpj: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john@acme.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8, example: 'Secret123!' })
  @MinLength(8)
  password: string;
}
