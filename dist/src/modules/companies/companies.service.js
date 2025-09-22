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
    async findById(id) {
        const company = await this.prisma.company.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                cnpj: true,
                phone: true,
                address: true,
                logoPath: true,
                letterheadPath: true,
                active: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        return {
            ...company,
            createdAt: company.createdAt.toISOString(),
            updatedAt: company.updatedAt.toISOString(),
        };
    }
    async update(id, updateDto, userId) {
        const membership = await this.prisma.companyMember.findUnique({
            where: {
                companyId_userId: {
                    companyId: id,
                    userId,
                },
            },
        });
        if (!membership || !['owner', 'admin'].includes(membership.role)) {
            throw new common_1.ForbiddenException('Insufficient permissions');
        }
        const updatedCompany = await this.prisma.company.update({
            where: { id },
            data: updateDto,
            select: {
                id: true,
                name: true,
                cnpj: true,
                phone: true,
                address: true,
                logoPath: true,
                letterheadPath: true,
                active: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return {
            ...updatedCompany,
            createdAt: updatedCompany.createdAt.toISOString(),
            updatedAt: updatedCompany.updatedAt.toISOString(),
        };
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map