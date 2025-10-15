import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/utils/prisma.service';
import { AddMemberDto, UpdateMemberRoleDto } from './dto';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  list(companyId: string) {
    return this.prisma.companyMember.findMany({
      where: { companyId },
      include: { user: { select: { id: true, email: true, fullName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async add(companyId: string, dto: AddMemberDto) {
    let userId = dto.userId;

    if (!userId && dto.userEmail) {
      const user = await this.prisma.appUser.findUnique({
        where: { email: dto.userEmail },
      });
      if (!user) throw new NotFoundException('User not found by email');
      userId = user.id;
    }

    if (!userId) throw new BadRequestException('Provide userId or userEmail');

    // já membro?
    const exists = await this.prisma.companyMember.findFirst({
      where: { companyId, userId },
    });
    if (exists) throw new BadRequestException('User already a member');

    return this.prisma.companyMember.create({
      data: { companyId, userId, role: dto.role },
    });
  }

  async updateRole(
    companyId: string,
    memberId: string,
    body: UpdateMemberRoleDto,
  ) {
    const member = await this.prisma.companyMember.findFirst({
      where: { id: memberId, companyId },
    });
    if (!member) throw new NotFoundException('Member not found');
    return this.prisma.companyMember.update({
      where: { id: memberId },
      data: { role: body.role },
    });
  }

  async remove(companyId: string, memberId: string) {
    const member = await this.prisma.companyMember.findFirst({
      where: { id: memberId, companyId },
    });
    if (!member) throw new NotFoundException('Member not found');
    return this.prisma.companyMember.delete({ where: { id: memberId } });
  }
}
