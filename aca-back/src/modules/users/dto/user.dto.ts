import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserMembershipDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  membershipId!: string;

  @ApiProperty({ enum: ['OWNER', 'ADMIN', 'MEMBER'], example: 'MEMBER' })
  role!: 'OWNER' | 'ADMIN' | 'MEMBER';

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  joinedAt!: string;

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Empresa ABC Ltda',
      cnpj: '12.345.678/0001-90',
      phone: '(11) 99999-9999',
      address: 'Rua das Flores, 123',
      logoPath: 'logos/empresa-abc.png',
      letterheadPath: 'letterheads/empresa-abc.png',
      active: true,
      createdAt: '2025-09-22T20:30:00.000Z',
      createdBy: '123e4567-e89b-12d3-a456-426614174000',
      creator: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        fullName: 'João Silva',
        email: 'joao@example.com'
      }
    }
  })
  company!: {
    id: string;
    name: string;
    cnpj?: string | null;
    phone?: string | null;
    address?: string | null;
    logoPath?: string | null;
    letterheadPath?: string | null;
    active: boolean;
    createdAt: string;
    createdBy: string;
    creator?: {
      id: string;
      fullName: string | null;
      email: string | null;
    } | null;
  };
}

export class UserOwnedCompanyDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 'Empresa ABC Ltda' })
  name!: string;

  @ApiPropertyOptional({ example: '12.345.678/0001-90' })
  cnpj?: string | null;

  @ApiPropertyOptional({ example: '(11) 99999-9999' })
  phone?: string | null;

  @ApiPropertyOptional({ example: 'Rua das Flores, 123' })
  address?: string | null;

  @ApiPropertyOptional({ example: 'logos/empresa-abc.png' })
  logoPath?: string | null;

  @ApiPropertyOptional({ example: 'letterheads/empresa-abc.png' })
  letterheadPath?: string | null;

  @ApiProperty({ example: true })
  active!: boolean;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  createdBy!: string;
}

export class UserRecentActivityDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  eventAt!: string;

  @ApiPropertyOptional({ example: 'Status alterado de draft para open' })
  description?: string | null;

  @ApiPropertyOptional({ enum: ['draft', 'open', 'closed', 'cancelled', 'awarded'], example: 'draft' })
  oldStatus?: string | null;

  @ApiPropertyOptional({ enum: ['draft', 'open', 'closed', 'cancelled', 'awarded'], example: 'open' })
  newStatus?: string | null;

  @ApiPropertyOptional({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Licitação para Fornecimento de Equipamentos',
      status: 'open',
      orgao: 'Prefeitura Municipal',
      modalidade: 'Pregão Eletrônico',
      createdAt: '2025-09-22T20:30:00.000Z',
      company: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Empresa ABC Ltda'
      }
    }
  })
  licitacao?: {
    id: string;
    title: string;
    status: string;
    orgao?: string | null;
    modalidade?: string | null;
    createdAt: string;
    company?: {
      id: string;
      name: string;
    } | null;
  } | null;
}

export class UserStatsDto {
  @ApiProperty({ example: 3 })
  totalMemberships!: number;

  @ApiProperty({ example: 2 })
  totalOwnedCompanies!: number;

  @ApiProperty({ example: 15 })
  totalEvents!: number;

  @ApiProperty({ example: 2 })
  activeMemberships!: number;

  @ApiProperty({ example: 1 })
  activeOwnedCompanies!: number;

  @ApiProperty({ example: 10 })
  recentEvents!: number;
}

export class UserPermissionsDto {
  @ApiProperty({ example: true })
  canCreateCompanies!: boolean;

  @ApiProperty({ example: true })
  canManageMembers!: boolean;

  @ApiProperty({ example: true })
  canManageDocuments!: boolean;

  @ApiProperty({ example: true })
  canManageBids!: boolean;
}

export class UserMeResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 'auth-user-123' })
  authUserId!: string;

  @ApiPropertyOptional({ example: 'João Silva' })
  fullName?: string | null;

  @ApiPropertyOptional({ example: 'joao@example.com' })
  email?: string | null;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  createdAt!: string;

  @ApiProperty({ type: [UserMembershipDto], nullable: true })
  memberships!: UserMembershipDto[] | null;

  @ApiProperty({ type: [UserOwnedCompanyDto], nullable: true })
  ownedCompanies!: UserOwnedCompanyDto[] | null;

  @ApiProperty({ type: [UserRecentActivityDto], nullable: true })
  recentActivity!: UserRecentActivityDto[] | null;

  @ApiProperty({ type: UserStatsDto })
  stats!: UserStatsDto;

  @ApiProperty({ type: UserPermissionsDto })
  permissions!: UserPermissionsDto;
}
