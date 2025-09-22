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

  update(companyId: string, dto: UpdateCompanyDto) {
    return this.prisma.company.update({ where: { id: companyId }, data: dto });
  }

  async myCompanies(authUserId: string) {
    const user = await this.prisma.appUser.findUnique({
      where: { authUserId },
      include: { memberships: { include: { company: true } } },
    });
    return user?.memberships?.map(m => ({ role: m.role, company: m.company })) ?? [];
  }
}
