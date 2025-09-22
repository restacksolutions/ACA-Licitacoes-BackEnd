import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async list(companyId: string) {
    return this.prisma.companyMember.findMany({
      where: { companyId },
      include: { user: true },
    });
  }

  async invite(companyId: string, email: string, role: 'owner'|'admin'|'member') {
    const user = await this.prisma.appUser.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Usuário não encontrado (convite pendente não implementado)');
    const exists = await this.prisma.companyMember.findFirst({ where: { companyId, userId: user.id }});
    if (exists) throw new BadRequestException('Já é membro');
    return this.prisma.companyMember.create({ data: { companyId, userId: user.id, role } });
  }

  async updateRole(memberId: string, role: 'owner'|'admin'|'member') {
    return this.prisma.companyMember.update({ where: { id: memberId }, data: { role } });
  }

  async remove(memberId: string) {
    return this.prisma.companyMember.delete({ where: { id: memberId } });
  }
}
