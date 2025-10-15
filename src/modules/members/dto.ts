import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMemberDto {
  @ApiProperty({
    description: 'ID do usuário (opcional se userEmail for fornecido)',
    example: 'uuid-do-usuario',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'Email do usuário (opcional se userId for fornecido)',
    example: 'usuario@exemplo.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  userEmail?: string;

  @ApiProperty({
    description: 'Papel do membro na empresa',
    enum: ['owner', 'admin', 'member'],
    example: 'member',
  })
  @IsIn(['owner', 'admin', 'member'])
  role: 'owner' | 'admin' | 'member';
}

export class UpdateMemberRoleDto {
  @ApiProperty({
    description: 'Novo papel do membro na empresa',
    enum: ['owner', 'admin', 'member'],
    example: 'admin',
  })
  @IsIn(['owner', 'admin', 'member'])
  role: 'owner' | 'admin' | 'member';
}
