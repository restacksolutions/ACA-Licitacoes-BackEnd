import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiPropertyOptional({ example: 'João Silva' })
  fullName?: string;

  @ApiProperty({ example: 'joao@example.com' })
  email!: string;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  createdAt!: string;
}

export class CompanyResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 'Empresa do João' })
  name!: string;

  @ApiPropertyOptional({ example: '00.000.000/0001-00' })
  cnpj?: string;

  @ApiProperty({ example: true })
  active!: boolean;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  createdAt!: string;
}

export class MembershipResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 'owner', enum: ['owner', 'admin', 'member'] })
  role!: string;
}

export class AuthResponseDto {
  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token for API authentication'
  })
  access_token!: string;

  @ApiProperty({ 
    example: '2025-09-23T21:28:56.693Z',
    description: 'Access token expiration time in ISO format'
  })
  access_expires_at!: string;

  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT refresh token for token renewal'
  })
  refresh_token!: string;

  @ApiProperty({ 
    example: '2025-09-30T21:28:56.693Z',
    description: 'Refresh token expiration time in ISO format'
  })
  refresh_expires_at!: string;

  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;

  @ApiProperty({ type: CompanyResponseDto })
  company!: CompanyResponseDto;

  @ApiProperty({ type: MembershipResponseDto })
  membership!: MembershipResponseDto;
}
