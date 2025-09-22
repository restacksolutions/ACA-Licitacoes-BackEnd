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
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const argon_adapter_1 = require("../../adapters/hashing/argon.adapter");
const jose_1 = require("jose");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    constructor(prisma, argon, configService) {
        this.prisma = prisma;
        this.argon = argon;
        this.configService = configService;
    }
    async register(registerDto) {
        const { fullName, email, password, company } = registerDto;
        const existingUser = await this.prisma.appUser.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const passwordHash = await this.argon.hash(password);
        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.appUser.create({
                data: {
                    fullName,
                    email,
                    passwordHash,
                },
            });
            const companyData = await tx.company.create({
                data: {
                    name: company.name,
                    cnpj: company.cnpj,
                    phone: company.phone,
                    address: company.address,
                    logoPath: company.logoPath,
                    letterheadPath: company.letterheadPath,
                    createdById: user.id,
                },
            });
            const membership = await tx.companyMember.create({
                data: {
                    companyId: companyData.id,
                    userId: user.id,
                    role: client_1.RoleCompany.owner,
                },
            });
            return { user, company: companyData, membership };
        });
        const tokens = await this.generateTokens(result.user.id, result.user.email);
        return {
            ...tokens,
            user: {
                id: result.user.id,
                fullName: result.user.fullName,
                email: result.user.email,
                createdAt: result.user.createdAt.toISOString(),
            },
            company: {
                id: result.company.id,
                name: result.company.name,
                cnpj: result.company.cnpj,
                active: result.company.active,
                createdAt: result.company.createdAt.toISOString(),
            },
            membership: {
                id: result.membership.id,
                role: result.membership.role,
            },
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.prisma.appUser.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isValidPassword = await this.argon.verify(user.passwordHash, password);
        if (!isValidPassword) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const membership = await this.prisma.companyMember.findFirst({
            where: { userId: user.id },
            include: { company: true },
        });
        if (!membership) {
            throw new common_1.UnauthorizedException('User has no company membership');
        }
        const tokens = await this.generateTokens(user.id, user.email);
        return {
            ...tokens,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                createdAt: user.createdAt.toISOString(),
            },
            company: {
                id: membership.company.id,
                name: membership.company.name,
                cnpj: membership.company.cnpj,
                active: membership.company.active,
                createdAt: membership.company.createdAt.toISOString(),
            },
            membership: {
                id: membership.id,
                role: membership.role,
            },
        };
    }
    async refresh(refreshDto) {
        const { refresh_token } = refreshDto;
        try {
            const secret = new TextEncoder().encode(this.configService.get('JWT_REFRESH_SECRET'));
            const { payload } = await (0, jose_1.jwtVerify)(refresh_token, secret, {
                algorithms: ['HS256'],
            });
            const user = await this.prisma.appUser.findUnique({
                where: { id: payload.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const membership = await this.prisma.companyMember.findFirst({
                where: { userId: user.id },
                include: { company: true },
            });
            if (!membership) {
                throw new common_1.UnauthorizedException('User has no company membership');
            }
            const tokens = await this.generateTokens(user.id, user.email);
            return {
                ...tokens,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    createdAt: user.createdAt.toISOString(),
                },
                company: {
                    id: membership.company.id,
                    name: membership.company.name,
                    cnpj: membership.company.cnpj,
                    active: membership.company.active,
                    createdAt: membership.company.createdAt.toISOString(),
                },
                membership: {
                    id: membership.id,
                    role: membership.role,
                },
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async me(userId) {
        const user = await this.prisma.appUser.findUnique({
            where: { id: userId },
            select: {
                id: true,
                fullName: true,
                email: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
        };
    }
    async generateTokens(userId, email) {
        const accessSecret = new TextEncoder().encode(this.configService.get('JWT_ACCESS_SECRET'));
        const refreshSecret = new TextEncoder().encode(this.configService.get('JWT_REFRESH_SECRET'));
        const now = Math.floor(Date.now() / 1000);
        const accessExpiresIn = this.configService.get('JWT_ACCESS_EXPIRES');
        const refreshExpiresIn = this.configService.get('JWT_REFRESH_EXPIRES');
        const accessToken = await new jose_1.SignJWT({ sub: userId, email })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(accessExpiresIn)
            .sign(accessSecret);
        const refreshToken = await new jose_1.SignJWT({ sub: userId, email })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(refreshExpiresIn)
            .sign(refreshSecret);
        const accessExpiresAt = new Date(now + this.parseExpirationTime(accessExpiresIn)).toISOString();
        const refreshExpiresAt = new Date(now + this.parseExpirationTime(refreshExpiresIn)).toISOString();
        return {
            access_token: accessToken,
            access_expires_at: accessExpiresAt,
            refresh_token: refreshToken,
            refresh_expires_at: refreshExpiresAt,
        };
    }
    parseExpirationTime(expiresIn) {
        const unit = expiresIn.slice(-1);
        const value = parseInt(expiresIn.slice(0, -1));
        switch (unit) {
            case 'm': return value * 60;
            case 'h': return value * 60 * 60;
            case 'd': return value * 60 * 60 * 24;
            default: return value;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        argon_adapter_1.ArgonAdapter,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map