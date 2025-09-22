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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const supabase_auth_service_1 = require("../../core/auth/supabase-auth.service");
let AuthService = class AuthService {
    constructor(prisma, supabaseAuth) {
        this.prisma = prisma;
        this.supabaseAuth = supabaseAuth;
    }
    async login(loginDto) {
        const authResult = await this.supabaseAuth.login(loginDto.email, loginDto.password);
        let user = await this.prisma.appUser.findUnique({
            where: { authUserId: authResult.user_id },
        });
        if (!user) {
            user = await this.prisma.appUser.create({
                data: {
                    authUserId: authResult.user_id,
                    email: authResult.email,
                    fullName: authResult.email.split('@')[0],
                },
            });
        }
        return authResult;
    }
    async register(registerDto) {
        const existingUser = await this.prisma.appUser.findUnique({
            where: { email: registerDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email já está em uso');
        }
        if (registerDto.companyCnpj) {
            const existingCompany = await this.prisma.company.findUnique({
                where: { cnpj: registerDto.companyCnpj },
            });
            if (existingCompany) {
                throw new common_1.ConflictException('CNPJ já está em uso');
            }
        }
        const authResult = await this.supabaseAuth.register(registerDto.email, registerDto.password);
        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.appUser.create({
                data: {
                    authUserId: authResult.user_id,
                    email: registerDto.email,
                    fullName: registerDto.fullName,
                },
            });
            const company = await tx.company.create({
                data: {
                    name: registerDto.companyName,
                    cnpj: registerDto.companyCnpj,
                    phone: registerDto.companyPhone,
                    address: registerDto.companyAddress,
                    createdById: user.id,
                },
            });
            await tx.companyMember.create({
                data: {
                    companyId: company.id,
                    userId: user.id,
                    role: 'owner',
                },
            });
            return { user, company };
        });
        return {
            ...authResult,
            company_id: result.company.id,
        };
    }
    async me(authUserId) {
        const user = await this.prisma.appUser.findUnique({
            where: { authUserId },
            include: {
                memberships: {
                    include: { company: true },
                },
            },
        });
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        supabase_auth_service_1.SupabaseAuthService])
], AuthService);
//# sourceMappingURL=auth.service.js.map