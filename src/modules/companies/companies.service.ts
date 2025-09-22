import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { UpdateCompanyDto } from './dto/company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        cnpj: true,
        phone: true,
        address: true,
        logoPath: true,
        letterheadPath: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return {
      ...company,
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
    };
  }

  async update(id: string, updateDto: UpdateCompanyDto, userId: string) {
    // Check if user is owner or admin of the company
    const membership = await this.prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId: id,
          userId,
        },
      },
    });

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const updatedCompany = await this.prisma.company.update({
      where: { id },
      data: updateDto,
      select: {
        id: true,
        name: true,
        cnpj: true,
        phone: true,
        address: true,
        logoPath: true,
        letterheadPath: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...updatedCompany,
      createdAt: updatedCompany.createdAt.toISOString(),
      updatedAt: updatedCompany.updatedAt.toISOString(),
    };
  }
}
