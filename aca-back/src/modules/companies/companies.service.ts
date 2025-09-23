import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCompanyDto, createdById: string) {
    return this.prisma.company.create({ data: { ...dto, createdById } });
  }

  async getById(companyId: string) {
    const c = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!c) throw new NotFoundException('Empresa não encontrada');
    return c;
  }

  async update(companyId: string, dto: UpdateCompanyDto) {
    console.log('[CompaniesService.update] ===== ATUALIZANDO EMPRESA NO BANCO =====');
    console.log('[CompaniesService.update] CompanyId:', companyId);
    console.log('[CompaniesService.update] DTO:', dto);
    console.log('[CompaniesService.update] Dados para atualização:', { where: { id: companyId }, data: dto });
    
    try {
      // Verificar se a empresa existe antes de atualizar
      const existingCompany = await this.prisma.company.findUnique({ where: { id: companyId } });
      console.log('[CompaniesService.update] Empresa existente:', existingCompany);
      
      if (!existingCompany) {
        console.error('[CompaniesService.update] ERRO: Empresa não encontrada no banco');
        throw new NotFoundException('Empresa não encontrada');
      }
      
      console.log('[CompaniesService.update] Executando update no Prisma...');
      const result = await this.prisma.company.update({ where: { id: companyId }, data: dto });
      
      console.log('[CompaniesService.update] Resultado do update:', result);
      console.log('[CompaniesService.update] ===== ATUALIZAÇÃO NO BANCO CONCLUÍDA =====');
      
      return result;
    } catch (error) {
      console.error('[CompaniesService.update] ERRO durante atualização:', error);
      throw error;
    }
  }

  async myCompanies(authUserId: string) {
    const user = await this.prisma.appUser.findUnique({
      where: { authUserId },
      include: { memberships: { include: { company: true } } },
    });
    return user?.memberships?.map(m => ({ role: m.role, company: m.company })) ?? [];
  }
}
