import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/utils/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  // Lista empresas em que o usuário possui membership
  listByUser(userId: string, search?: string) {
    return this.prisma.company.findMany({
      where: {
        members: { some: { userId } },
        name: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getByIdForUser(id: string, userId: string) {
    const company = await this.prisma.company.findFirst({
      where: { id, members: { some: { userId } } },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async createAndOwn(userId: string, dto: CreateCompanyDto) {
    const company = await this.prisma.company.create({
      data: { name: dto.name, cnpj: dto.cnpj, createdById: userId },
    });
    await this.prisma.companyMember.create({
      data: { companyId: company.id, userId, role: 'owner' },
    });
    return company;
  }

  async update(companyId: string, dto: UpdateCompanyDto) {
    return this.prisma.company.update({ where: { id: companyId }, data: dto });
  }

  async remove(companyId: string) {
    // Opcional: checar dependências (ex.: licitações) antes de deletar
    return this.prisma.company.delete({ where: { id: companyId } });
  }
}
