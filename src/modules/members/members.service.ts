import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { InviteMemberDto, UpdateMemberRoleDto, MemberResponseDto } from './dto/invite.dto';
import { RoleCompany } from '@prisma/client';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string): Promise<MemberResponseDto[]> {
    const members = await this.prisma.companyMember.findMany({
      where: { companyId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return members.map(member => ({
      id: member.id,
      role: member.role,
      createdAt: member.createdAt.toISOString(),
      updatedAt: member.updatedAt.toISOString(),
      user: member.user,
    }));
  }

  async invite(companyId: string, inviteDto: InviteMemberDto, inviterId: string): Promise<MemberResponseDto> {
    // Check if inviter has permission
    const inviterMembership = await this.prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId,
          userId: inviterId,
        },
      },
    });

    if (!inviterMembership || !['owner', 'admin'].includes(inviterMembership.role)) {
      throw new ForbiddenException('Insufficient permissions to invite members');
    }

    // Find user by email
    const user = await this.prisma.appUser.findUnique({
      where: { email: inviteDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found with this email');
    }

    // Check if user is already a member
    const existingMembership = await this.prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId,
          userId: user.id,
        },
      },
    });

    if (existingMembership) {
      throw new ConflictException('User is already a member of this company');
    }

    // Create membership
    const membership = await this.prisma.companyMember.create({
      data: {
        companyId,
        userId: user.id,
        role: inviteDto.role,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return {
      id: membership.id,
      role: membership.role,
      createdAt: membership.createdAt.toISOString(),
      updatedAt: membership.updatedAt.toISOString(),
      user: membership.user,
    };
  }

  async updateRole(
    companyId: string,
    memberId: string,
    updateDto: UpdateMemberRoleDto,
    updaterId: string,
  ): Promise<MemberResponseDto> {
    // Check if updater has permission
    const updaterMembership = await this.prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId,
          userId: updaterId,
        },
      },
    });

    if (!updaterMembership || !['owner', 'admin'].includes(updaterMembership.role)) {
      throw new ForbiddenException('Insufficient permissions to update member roles');
    }

    // Find the member to update
    const member = await this.prisma.companyMember.findUnique({
      where: { id: memberId },
    });

    if (!member || member.companyId !== companyId) {
      throw new NotFoundException('Member not found');
    }

    // Prevent non-owners from updating owner roles
    if (member.role === RoleCompany.owner && updaterMembership.role !== RoleCompany.owner) {
      throw new ForbiddenException('Only owners can update owner roles');
    }

    // Update member role
    const updatedMember = await this.prisma.companyMember.update({
      where: { id: memberId },
      data: { role: updateDto.role },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return {
      id: updatedMember.id,
      role: updatedMember.role,
      createdAt: updatedMember.createdAt.toISOString(),
      updatedAt: updatedMember.updatedAt.toISOString(),
      user: updatedMember.user,
    };
  }

  async remove(companyId: string, memberId: string, removerId: string): Promise<void> {
    // Check if remover has permission
    const removerMembership = await this.prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId,
          userId: removerId,
        },
      },
    });

    if (!removerMembership || !['owner', 'admin'].includes(removerMembership.role)) {
      throw new ForbiddenException('Insufficient permissions to remove members');
    }

    // Find the member to remove
    const member = await this.prisma.companyMember.findUnique({
      where: { id: memberId },
    });

    if (!member || member.companyId !== companyId) {
      throw new NotFoundException('Member not found');
    }

    // Prevent removing the last owner
    if (member.role === RoleCompany.owner) {
      const ownerCount = await this.prisma.companyMember.count({
        where: {
          companyId,
          role: RoleCompany.owner,
        },
      });

      if (ownerCount <= 1) {
        throw new ForbiddenException('Cannot remove the last owner of the company');
      }
    }

    // Remove member
    await this.prisma.companyMember.delete({
      where: { id: memberId },
    });
  }
}
