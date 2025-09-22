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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let CompaniesService = class CompaniesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(dto, createdById) {
        return this.prisma.company.create({ data: { ...dto, createdById } });
    }
    async getById(companyId) {
        const c = await this.prisma.company.findUnique({ where: { id: companyId } });
        if (!c)
            throw new common_1.NotFoundException('Empresa não encontrada');
        return c;
    }
    update(companyId, dto) {
        return this.prisma.company.update({ where: { id: companyId }, data: dto });
    }
    async myCompanies(authUserId) {
        const user = await this.prisma.appUser.findUnique({
            where: { authUserId },
            include: { memberships: { include: { company: true } } },
        });
        return user?.memberships?.map(m => ({ role: m.role, company: m.company })) ?? [];
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map