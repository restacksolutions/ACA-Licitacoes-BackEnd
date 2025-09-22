import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsString } from 'class-validator';

export class InviteMemberDto {
  @ApiProperty({ example: 'usuario@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ enum: ['owner', 'admin', 'member'], example: 'member' })
  @IsIn(['owner', 'admin', 'member'])
  role!: 'owner' | 'admin' | 'member';
}

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: ['owner', 'admin', 'member'], example: 'admin' })
  @IsIn(['owner', 'admin', 'member'])
  role!: 'owner' | 'admin' | 'member';
}

export class MemberResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ enum: ['owner', 'admin', 'member'], example: 'member' })
  role!: 'owner' | 'admin' | 'member';

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  userId!: string;

  @ApiProperty({ example: 'João Silva' })
  userFullName!: string;

  @ApiProperty({ example: 'joao@example.com' })
  userEmail!: string;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  createdAt!: string;
}