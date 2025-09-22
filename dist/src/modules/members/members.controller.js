"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const members_service_1 = require("./members.service");
const invite_dto_1 = require("./dto/invite.dto");
const jwt_auth_guard_1 = require("../../core/security/jwt-auth.guard");
const company_guard_1 = require("../../core/tenancy/company.guard");
const roles_guard_1 = require("../../core/security/roles.guard");
const roles_decorator_1 = require("../../core/security/roles.decorator");
const current_user_decorator_1 = require("../../core/security/current-user.decorator");
let MembersController = class MembersController {
    constructor(membersService) {
        this.membersService = membersService;
    }
    async findAll(companyId) {
        return this.membersService.findAll(companyId);
    }
    async invite(companyId, inviteDto, user) {
        return this.membersService.invite(companyId, inviteDto, user.userId);
    }
    async updateRole(companyId, memberId, updateDto, user) {
        return this.membersService.updateRole(companyId, memberId, updateDto, user.userId);
    }
    async remove(companyId, memberId, user) {
        await this.membersService.remove(companyId, memberId, user.userId);
        return { message: 'Member removed successfully' };
    }
};
exports.MembersController = MembersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get company members' }),
    (0, swagger_1.ApiParam)({ name: 'companyId', description: 'Company ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Members retrieved successfully', type: [invite_dto_1.MemberResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('owner', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Invite a new member to the company' }),
    (0, swagger_1.ApiParam)({ name: 'companyId', description: 'Company ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Member invited successfully', type: invite_dto_1.MemberResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User is already a member' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, invite_dto_1.InviteMemberDto, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "invite", null);
__decorate([
    (0, common_1.Patch)(':memberId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('owner', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update member role' }),
    (0, swagger_1.ApiParam)({ name: 'companyId', description: 'Company ID' }),
    (0, swagger_1.ApiParam)({ name: 'memberId', description: 'Member ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member role updated successfully', type: invite_dto_1.MemberResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Member not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, invite_dto_1.UpdateMemberRoleDto, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)(':memberId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('owner', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove member from company' }),
    (0, swagger_1.ApiParam)({ name: 'companyId', description: 'Company ID' }),
    (0, swagger_1.ApiParam)({ name: 'memberId', description: 'Member ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member removed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Member not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "remove", null);
exports.MembersController = MembersController = __decorate([
    (0, swagger_1.ApiTags)('Members'),
    (0, common_1.Controller)('companies/:companyId/members'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_guard_1.CompanyGuard),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    __metadata("design:paramtypes", [members_service_1.MembersService])
], MembersController);
//# sourceMappingURL=members.controller.js.map