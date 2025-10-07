import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, MinLength, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'usuario@exemplo.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'usuario@exemplo.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: 'Minha Empresa LTDA' })
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @ApiPropertyOptional({ example: '12.345.678/0001-90' })
  @IsString()
  @IsOptional()
  companyCnpj?: string;

  @ApiPropertyOptional({ example: '(11) 99999-9999' })
  @IsString()
  @IsOptional()
  companyPhone?: string;

  @ApiPropertyOptional({ example: 'Rua das Flores, 123' })
  @IsString()
  @IsOptional()
  companyAddress?: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'uuid' })
  user_id!: string;

  @ApiProperty({ example: 'usuario@exemplo.com' })
  email!: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token!: string;

  @ApiProperty({ example: '2025-12-31T23:59:59Z' })
  expires_at!: string;

  @ApiProperty({ example: 'uuid' })
  company_id?: string;

  @ApiProperty({ example: 'Minha Empresa LTDA' })
  company_name?: string;
}

export class UserProfileDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'uuid' })
  authUserId!: string;

  @ApiProperty({ example: 'João Silva' })
  fullName!: string;

  @ApiProperty({ example: 'usuario@exemplo.com' })
  email!: string;

  @ApiProperty({ example: '2025-01-01T00:00:00Z' })
  createdAt!: string;

  @ApiProperty({ example: '2025-01-01T00:00:00Z' })
  updatedAt!: string;
}
