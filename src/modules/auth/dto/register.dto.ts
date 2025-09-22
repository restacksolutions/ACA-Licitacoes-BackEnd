import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, ValidateNested, Matches, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CompanyDto {
  @ApiProperty({ example: 'Empresa do João' })
  @IsString()
  @Length(1, 255)
  name!: string;

  @ApiPropertyOptional({ example: '00.000.000/0001-00' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/, {
    message: 'CNPJ must be in format 00.000.000/0001-00 or 14 digits'
  })
  cnpj?: string;

  @ApiPropertyOptional({ example: '11 99999-9999' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Rua das Flores, 123' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'path/to/logo.png' })
  @IsOptional()
  @IsString()
  logoPath?: string;

  @ApiPropertyOptional({ example: 'path/to/letterhead.png' })
  @IsOptional()
  @IsString()
  letterheadPath?: string;
}

export class RegisterDto {
  @ApiPropertyOptional({ example: 'João Silva' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  fullName?: string;

  @ApiProperty({ example: 'joao@example.com' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @ApiProperty({ 
    example: 'Senha123',
    description: 'Password must be at least 8 characters with at least 1 letter and 1 number'
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least 1 letter and 1 number'
  })
  password!: string;

  @ApiProperty({ type: CompanyDto })
  @ValidateNested()
  @Type(() => CompanyDto)
  company!: CompanyDto;
}
