import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { MembersService } from './members.service';
import { InviteMemberDto, UpdateMemberRoleDto, MemberResponseDto } from './dto/invite.dto';
import { JwtAuthGuard } from '../../core/security/jwt-auth.guard';
import { CompanyGuard } from '../../core/tenancy/company.guard';
import { RolesGuard } from '../../core/security/roles.guard';
import { Roles } from '../../core/security/roles.decorator';
import { CurrentUser } from '../../core/security/current-user.decorator';

@ApiTags('Members')
@Controller('companies/:companyId/members')
@UseGuards(JwtAuthGuard, CompanyGuard)
@ApiBearerAuth('bearer')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Get()
  @ApiOperation({ summary: 'Get company members' })
  @ApiParam({ name: 'companyId', description: 'Company ID' })
  @ApiResponse({ status: 200, description: 'Members retrieved successfully', type: [MemberResponseDto] })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async findAll(@Param('companyId') companyId: string): Promise<MemberResponseDto[]> {
    return this.membersService.findAll(companyId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('owner', 'admin')
  @ApiOperation({ summary: 'Invite a new member to the company' })
  @ApiParam({ name: 'companyId', description: 'Company ID' })
  @ApiResponse({ status: 201, description: 'Member invited successfully', type: MemberResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'User is already a member' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async invite(
    @Param('companyId') companyId: string,
    @Body() inviteDto: InviteMemberDto,
    @CurrentUser() user: any,
  ): Promise<MemberResponseDto> {
    return this.membersService.invite(companyId, inviteDto, user.userId);
  }

  @Patch(':memberId')
  @UseGuards(RolesGuard)
  @Roles('owner', 'admin')
  @ApiOperation({ summary: 'Update member role' })
  @ApiParam({ name: 'companyId', description: 'Company ID' })
  @ApiParam({ name: 'memberId', description: 'Member ID' })
  @ApiResponse({ status: 200, description: 'Member role updated successfully', type: MemberResponseDto })
  @ApiResponse({ status: 404, description: 'Member not found' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async updateRole(
    @Param('companyId') companyId: string,
    @Param('memberId') memberId: string,
    @Body() updateDto: UpdateMemberRoleDto,
    @CurrentUser() user: any,
  ): Promise<MemberResponseDto> {
    return this.membersService.updateRole(companyId, memberId, updateDto, user.userId);
  }

  @Delete(':memberId')
  @UseGuards(RolesGuard)
  @Roles('owner', 'admin')
  @ApiOperation({ summary: 'Remove member from company' })
  @ApiParam({ name: 'companyId', description: 'Company ID' })
  @ApiParam({ name: 'memberId', description: 'Member ID' })
  @ApiResponse({ status: 200, description: 'Member removed successfully' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async remove(
    @Param('companyId') companyId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: any,
  ): Promise<{ message: string }> {
    await this.membersService.remove(companyId, memberId, user.userId);
    return { message: 'Member removed successfully' };
  }
}
