import { Body, Controller, Get, Param, Patch, Post, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/security/jwt-auth.guard';
import { CompanyGuard } from '../../core/tenancy/company.guard';
import { RolesGuard } from '../../core/security/roles.guard';
import { Roles } from '../../core/security/roles.decorator';
import { CurrentUser } from '../../core/security/current-user.decorator';
import { CurrentCompany } from '../../core/tenancy/current-company.decorator';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto, CompanyResponseDto } from './dto/company.dto';
import { UserHelper } from '../../core/security/user-helper.service';

@ApiTags('Companies')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly svc: CompaniesService,
    private readonly userHelper: UserHelper,
  ) {}

  @Get()
  async myCompanies(@CurrentUser() user: { authUserId: string }) {
    return this.svc.myCompanies(user.authUserId);
  }

  @Post()
  async create(@Body() dto: CreateCompanyDto, @CurrentUser() user: { authUserId: string }) {
    const userId = await this.userHelper.internalUserId(user.authUserId);
    if (!userId) throw new NotFoundException('Usuário não encontrado no sistema');
    return this.svc.create(dto, userId);
  }

  @UseGuards(CompanyGuard)
  @Get(':companyId')
  async get(@Param('companyId') companyId: string, @CurrentCompany() _ctx: string) {
    return this.svc.getById(companyId);
  }

  @UseGuards(CompanyGuard, RolesGuard)
  @Roles('owner','admin')
  @Patch(':companyId')
  async update(@Param('companyId') companyId: string, @Body() dto: UpdateCompanyDto) {
    console.log('[CompaniesController.update] ===== ATUALIZANDO EMPRESA =====');
    console.log('[CompaniesController.update] CompanyId recebido:', companyId);
    console.log('[CompaniesController.update] Tipo do companyId:', typeof companyId);
    console.log('[CompaniesController.update] DTO recebido:', dto);
    console.log('[CompaniesController.update] Chaves do DTO:', Object.keys(dto));
    console.log('[CompaniesController.update] Chamando svc.update...');
    
    const result = await this.svc.update(companyId, dto);
    
    console.log('[CompaniesController.update] Resultado do svc.update:', result);
    console.log('[CompaniesController.update] ===== ATUALIZAÇÃO CONCLUÍDA =====');
    
    return result;
  }
}
