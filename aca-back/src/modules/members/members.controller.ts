import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/security/jwt-auth.guard';
import { CompanyGuard } from '../../core/tenancy/company.guard';
import { RolesGuard } from '../../core/security/roles.guard';
import { Roles } from '../../core/security/roles.decorator';
import { InviteMemberDto, UpdateMemberRoleDto, MemberResponseDto } from './dto/member.dto';
import { MembersService } from './members.service';

@ApiTags('Members')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, CompanyGuard)
@Controller('companies/:companyId/members')
export class MembersController {
  constructor(private readonly svc: MembersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar membros da empresa' })
  @ApiResponse({ status: 200, description: 'Lista de membros da empresa' })
  async list(@Param('companyId') companyId: string) {
    return this.svc.list(companyId);
  }

  @UseGuards(RolesGuard)
  @Roles('owner','admin')
  @Post()
  @ApiOperation({ summary: 'Adicionar membro à empresa' })
  @ApiResponse({ status: 201, description: 'Membro adicionado com sucesso' })
  async invite(@Param('companyId') companyId: string, @Body() dto: InviteMemberDto) {
    return this.svc.invite(companyId, dto.email, dto.role);
  }

  @UseGuards(RolesGuard)
  @Roles('owner','admin')
  @Patch(':memberId')
  @ApiOperation({ summary: 'Atualizar papel do membro' })
  @ApiResponse({ status: 200, description: 'Papel atualizado com sucesso' })
  async updateRole(@Param('memberId') memberId: string, @Body() dto: UpdateMemberRoleDto) {
    return this.svc.updateRole(memberId, dto.role);
  }

  @UseGuards(RolesGuard)
  @Roles('owner','admin')
  @Delete(':memberId')
  @ApiOperation({ summary: 'Remover membro da empresa' })
  @ApiResponse({ status: 200, description: 'Membro removido com sucesso' })
  async remove(@Param('memberId') memberId: string) {
    return this.svc.remove(memberId);
  }
}
