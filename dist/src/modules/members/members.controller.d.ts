import { MembersService } from './members.service';
import { InviteMemberDto, UpdateMemberRoleDto, MemberResponseDto } from './dto/invite.dto';
export declare class MembersController {
    private membersService;
    constructor(membersService: MembersService);
    findAll(companyId: string): Promise<MemberResponseDto[]>;
    invite(companyId: string, inviteDto: InviteMemberDto, user: any): Promise<MemberResponseDto>;
    updateRole(companyId: string, memberId: string, updateDto: UpdateMemberRoleDto, user: any): Promise<MemberResponseDto>;
    remove(companyId: string, memberId: string, user: any): Promise<{
        message: string;
    }>;
}
