import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.appUser.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async findMemberships(userId: string) {
    return this.prisma.companyMember.findMany({
      where: { userId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            cnpj: true,
            active: true,
          },
        },
      },
    });
  }
}
