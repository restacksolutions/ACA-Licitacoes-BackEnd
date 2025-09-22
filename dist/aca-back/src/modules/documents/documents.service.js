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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const supabase_storage_1 = require("../../adapters/storage/supabase.storage");
const ulid_1 = require("ulid");
let DocumentsService = class DocumentsService {
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    list(companyId) {
        return this.prisma.companyDocument.findMany({ where: { companyId } });
    }
    create(companyId, dto) {
        return this.prisma.companyDocument.create({ data: { companyId, ...dto } });
    }
    async upload(companyId, docId, buffer, mime) {
        const doc = await this.prisma.companyDocument.findFirst({ where: { id: docId, companyId } });
        if (!doc)
            throw new common_1.NotFoundException('Documento não encontrado');
        const path = `companies/${companyId}/docs/${docId}/${(0, ulid_1.ulid)()}`;
        await this.storage.uploadObject(path, buffer, mime);
        return this.prisma.companyDocument.update({ where: { id: docId }, data: { filePath: path, updatedAt: new Date() } });
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, supabase_storage_1.SupabaseStorage])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map