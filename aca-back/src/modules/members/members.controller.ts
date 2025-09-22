import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
  async list(@Param('companyId') companyId: string) {
    return this.svc.list(companyId);
  }

  @UseGuards(RolesGuard)
  @Roles('owner','admin')
  @Post()
  async invite(@Param('companyId') companyId: string, @Body() dto: InviteMemberDto) {
    return this.svc.invite(companyId, dto.email, dto.role);
  }

  @UseGuards(RolesGuard)
  @Roles('owner','admin')
  @Patch(':memberId')
  async updateRole(@Param('memberId') memberId: string, @Body() dto: InviteMemberDto) {
    return this.svc.updateRole(memberId, dto.role);
  }

  @UseGuards(RolesGuard)
  @Roles('owner','admin')
  @Delete(':memberId')
  async remove(@Param('memberId') memberId: string) {
    return this.svc.remove(memberId);
  }
}
