import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { RoleCompany } from '@prisma/client';

export class InviteMemberDto {
  @ApiProperty({ example: 'newuser@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'member', enum: RoleCompany })
  @IsEnum(RoleCompany)
  @IsOptional()
  role?: RoleCompany = RoleCompany.member;
}

export class UpdateMemberRoleDto {
  @ApiProperty({ example: 'admin', enum: RoleCompany })
  @IsEnum(RoleCompany)
  role!: RoleCompany;
}

export class MemberResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 'member', enum: RoleCompany })
  role!: RoleCompany;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2025-09-22T20:30:00.000Z' })
  updatedAt!: string;

  @ApiProperty()
  user!: {
    id: string;
    fullName: string;
    email: string;
  };
}
