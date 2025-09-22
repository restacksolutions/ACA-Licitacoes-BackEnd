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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../core/prisma/prisma.service");
const public_decorator_1 = require("../core/security/public.decorator");
let HealthController = class HealthController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
        };
    }
    async getDatabaseHealth() {
        try {
            await this.prisma.$queryRaw `SELECT 1 as test`;
            const tables = await this.prisma.$queryRaw `
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      `;
            return {
                status: 'ok',
                database: 'connected',
                tables: tables,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                status: 'error',
                database: 'disconnected',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getPrismaInfo() {
        try {
            const counts = await Promise.all([
                this.prisma.appUser.count(),
                this.prisma.company.count(),
                this.prisma.companyMember.count(),
                this.prisma.companyDocument.count(),
                this.prisma.licitacao.count(),
                this.prisma.licitacaoDocument.count(),
                this.prisma.licitacaoEvent.count(),
            ]);
            return {
                status: 'ok',
                prisma: {
                    version: '6.16.2',
                    database: 'SQLite',
                    tables: {
                        appUsers: counts[0],
                        companies: counts[1],
                        companyMembers: counts[2],
                        companyDocuments: counts[3],
                        licitacoes: counts[4],
                        licitacaoDocuments: counts[5],
                        licitacaoEvents: counts[6],
                    },
                },
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                status: 'error',
                prisma: 'error',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Health check básico' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'API funcionando' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('database'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Teste de conexão com o banco de dados' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Banco conectado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Erro na conexão com o banco' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getDatabaseHealth", null);
__decorate([
    (0, common_1.Get)('prisma'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Informações do Prisma' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Informações do Prisma' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getPrismaInfo", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HealthController);
//# sourceMappingURL=health.controller.js.map