import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: 'Empresa do João' })
  @IsString()
  companyName!: string;

  @ApiPropertyOptional({ example: '11.222.333/0001-44' })
  @IsOptional()
  @IsString()
  companyCnpj?: string;

  @ApiPropertyOptional({ example: '(11) 99999-9999' })
  @IsOptional()
  @IsString()
  companyPhone?: string;

  @ApiPropertyOptional({ example: 'Rua das Flores, 123' })
  @IsOptional()
  @IsString()
  companyAddress?: string;
}

export class RegisterResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token!: string;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  expires_at!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  user_id!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  company_id!: string;
}
