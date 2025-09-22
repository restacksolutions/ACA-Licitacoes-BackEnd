import { PrismaService } from '../../core/prisma/prisma.service';
import { InviteMemberDto, UpdateMemberRoleDto, MemberResponseDto } from './dto/invite.dto';
export declare class MembersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(companyId: string): Promise<MemberResponseDto[]>;
    invite(companyId: string, inviteDto: InviteMemberDto, inviterId: string): Promise<MemberResponseDto>;
    updateRole(companyId: string, memberId: string, updateDto: UpdateMemberRoleDto, updaterId: string): Promise<MemberResponseDto>;
    remove(companyId: string, memberId: string, removerId: string): Promise<void>;
}
