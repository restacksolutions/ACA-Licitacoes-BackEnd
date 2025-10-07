import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(userData: {
    authUserId: string;
    email: string;
    fullName: string;
  }) {
    try {
      // Verificar se o usuário já existe
      const existingUser = await this.prisma.appUser.findUnique({
        where: { authUserId: userData.authUserId },
      });

      if (existingUser) {
        return existingUser;
      }

      const user = await this.prisma.appUser.create({
        data: {
          authUserId: userData.authUserId,
          email: userData.email,
          fullName: userData.fullName,
        },
      });

      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Usuário já existe');
      }
      throw error;
    }
  }

  async findUserByAuthId(authUserId: string) {
    const user = await this.prisma.appUser.findUnique({
      where: { authUserId },
      include: {
        memberships: {
          include: { company: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.appUser.findUnique({
      where: { email },
      include: {
        memberships: {
          include: { company: true },
        },
      },
    });

    return user;
  }

  async createCompany(companyData: {
    name: string;
    cnpj?: string;
    phone?: string;
    address?: string;
    createdById: string;
  }) {
    try {
      // Se CNPJ foi fornecido, verificar se já existe
      if (companyData.cnpj) {
        const existingCompany = await this.prisma.company.findUnique({
          where: { cnpj: companyData.cnpj },
        });

        if (existingCompany) {
          throw new ConflictException('CNPJ já está em uso');
        }
      }

      const company = await this.prisma.company.create({
        data: {
          name: companyData.name,
          cnpj: companyData.cnpj,
          phone: companyData.phone,
          address: companyData.address,
          createdById: companyData.createdById,
        },
      });

      return company;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new ConflictException('CNPJ já está em uso');
      }
      throw error;
    }
  }

  async addUserToCompany(userId: string, companyId: string, role: string = 'owner') {
    try {
      const membership = await this.prisma.companyMember.create({
        data: {
          userId,
          companyId,
          role: role as any,
        },
      });

      return membership;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Usuário já é membro desta empresa');
      }
      throw error;
    }
  }

  async getUserWithCompanies(authUserId: string) {
    const user = await this.prisma.appUser.findUnique({
      where: { authUserId },
      include: {
        memberships: {
          include: { company: true },
        },
        createdCompanies: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async ensureUserHasCompany(authUserId: string) {
    const user = await this.getUserWithCompanies(authUserId);
    
    // Se usuário não tem empresas, criar uma empresa padrão
    if (!user.memberships || user.memberships.length === 0) {
      const company = await this.createCompany({
        name: `Empresa de ${user.fullName || user.email.split('@')[0]}`,
        createdById: user.id,
      });

      await this.addUserToCompany(user.id, company.id, 'owner');
      
      return company;
    }

    return user.memberships[0].company;
  }
}
