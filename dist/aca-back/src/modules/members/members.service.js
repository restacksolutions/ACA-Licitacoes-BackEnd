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
let MembersService = class MembersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(companyId) {
        return this.prisma.companyMember.findMany({
            where: { companyId },
            include: { user: true },
        });
    }
    async invite(companyId, email, role) {
        const user = await this.prisma.appUser.findUnique({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado (convite pendente não implementado)');
        const exists = await this.prisma.companyMember.findFirst({ where: { companyId, userId: user.id } });
        if (exists)
            throw new common_1.BadRequestException('Já é membro');
        return this.prisma.companyMember.create({ data: { companyId, userId: user.id, role } });
    }
    async updateRole(memberId, role) {
        return this.prisma.companyMember.update({ where: { id: memberId }, data: { role } });
    }
    async remove(memberId) {
        return this.prisma.companyMember.delete({ where: { id: memberId } });
    }
};
exports.MembersService = MembersService;
exports.MembersService = MembersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MembersService);
//# sourceMappingURL=members.service.js.map