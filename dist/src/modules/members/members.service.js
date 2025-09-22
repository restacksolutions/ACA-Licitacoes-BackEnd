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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const client_1 = require("@prisma/client");
let MembersService = class MembersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(companyId) {
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
    async invite(companyId, inviteDto, inviterId) {
        const inviterMembership = await this.prisma.companyMember.findUnique({
            where: {
                companyId_userId: {
                    companyId,
                    userId: inviterId,
                },
            },
        });
        if (!inviterMembership || !['owner', 'admin'].includes(inviterMembership.role)) {
            throw new common_1.ForbiddenException('Insufficient permissions to invite members');
        }
        const user = await this.prisma.appUser.findUnique({
            where: { email: inviteDto.email },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found with this email');
        }
        const existingMembership = await this.prisma.companyMember.findUnique({
            where: {
                companyId_userId: {
                    companyId,
                    userId: user.id,
                },
            },
        });
        if (existingMembership) {
            throw new common_1.ConflictException('User is already a member of this company');
        }
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
    async updateRole(companyId, memberId, updateDto, updaterId) {
        const updaterMembership = await this.prisma.companyMember.findUnique({
            where: {
                companyId_userId: {
                    companyId,
                    userId: updaterId,
                },
            },
        });
        if (!updaterMembership || !['owner', 'admin'].includes(updaterMembership.role)) {
            throw new common_1.ForbiddenException('Insufficient permissions to update member roles');
        }
        const member = await this.prisma.companyMember.findUnique({
            where: { id: memberId },
        });
        if (!member || member.companyId !== companyId) {
            throw new common_1.NotFoundException('Member not found');
        }
        if (member.role === client_1.RoleCompany.owner && updaterMembership.role !== client_1.RoleCompany.owner) {
            throw new common_1.ForbiddenException('Only owners can update owner roles');
        }
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
    async remove(companyId, memberId, removerId) {
        const removerMembership = await this.prisma.companyMember.findUnique({
            where: {
                companyId_userId: {
                    companyId,
                    userId: removerId,
                },
            },
        });
        if (!removerMembership || !['owner', 'admin'].includes(removerMembership.role)) {
            throw new common_1.ForbiddenException('Insufficient permissions to remove members');
        }
        const member = await this.prisma.companyMember.findUnique({
            where: { id: memberId },
        });
        if (!member || member.companyId !== companyId) {
            throw new common_1.NotFoundException('Member not found');
        }
        if (member.role === client_1.RoleCompany.owner) {
            const ownerCount = await this.prisma.companyMember.count({
                where: {
                    companyId,
                    role: client_1.RoleCompany.owner,
                },
            });
            if (ownerCount <= 1) {
                throw new common_1.ForbiddenException('Cannot remove the last owner of the company');
            }
        }
        await this.prisma.companyMember.delete({
            where: { id: memberId },
        });
    }
};
exports.MembersService = MembersService;
exports.MembersService = MembersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MembersService);
//# sourceMappingURL=members.service.js.map