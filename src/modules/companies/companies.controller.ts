import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { UpdateCompanyDto, CompanyResponseDto } from './dto/company.dto';
import { JwtAuthGuard } from '../../core/security/jwt-auth.guard';
import { CompanyGuard } from '../../core/tenancy/company.guard';
import { RolesGuard } from '../../core/security/roles.guard';
import { Roles } from '../../core/security/roles.decorator';
import { CurrentUser } from '../../core/security/current-user.decorator';

@ApiTags('Companies')
@Controller('companies')
@UseGuards(JwtAuthGuard, CompanyGuard)
@ApiBearerAuth('bearer')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get(':companyId')
  @ApiOperation({ summary: 'Get company details' })
  @ApiParam({ name: 'companyId', description: 'Company ID' })
  @ApiResponse({ status: 200, description: 'Company details retrieved successfully', type: CompanyResponseDto })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async findOne(@Param('companyId') companyId: string): Promise<CompanyResponseDto> {
    return this.companiesService.findById(companyId);
  }

  @Patch(':companyId')
  @UseGuards(RolesGuard)
  @Roles('owner', 'admin')
  @ApiOperation({ summary: 'Update company details' })
  @ApiParam({ name: 'companyId', description: 'Company ID' })
  @ApiResponse({ status: 200, description: 'Company updated successfully', type: CompanyResponseDto })
  @ApiResponse({ status: 404, description: 'Company not found' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async update(
    @Param('companyId') companyId: string,
    @Body() updateDto: UpdateCompanyDto,
    @CurrentUser() user: any,
  ): Promise<CompanyResponseDto> {
    return this.companiesService.update(companyId, updateDto, user.userId);
  }
}
