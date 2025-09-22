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
exports.BidsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let BidsService = class BidsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(companyId) {
        return this.prisma.licitacao.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' } });
    }
    create(companyId, dto) {
        return this.prisma.licitacao.create({ data: { companyId, ...dto } });
    }
    async get(companyId, bidId) {
        const b = await this.prisma.licitacao.findFirst({ where: { id: bidId, companyId } });
        if (!b)
            throw new common_1.NotFoundException('Licitação não encontrada');
        return b;
    }
    update(companyId, bidId, dto) {
        return this.prisma.licitacao.update({ where: { id: bidId }, data: dto });
    }
    remove(bidId) {
        return this.prisma.licitacao.delete({ where: { id: bidId } });
    }
};
exports.BidsService = BidsService;
exports.BidsService = BidsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BidsService);
//# sourceMappingURL=bids.service.js.map