import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token!: string;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  expires_at!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  user_id!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  active_company_id!: string;

  @ApiProperty({ example: 'Empresa do João' })
  active_company_name!: string;
}
