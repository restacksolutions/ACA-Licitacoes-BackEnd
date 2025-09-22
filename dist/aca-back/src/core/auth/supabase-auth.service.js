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
exports.SupabaseAuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let SupabaseAuthService = class SupabaseAuthService {
    constructor(configService) {
        this.configService = configService;
        const supabaseUrl = this.configService.get('SUPABASE_PROJECT_URL') || 'https://placeholder.supabase.co';
        const supabaseKey = this.configService.get('SUPABASE_ANON_KEY') || 'placeholder-key';
        this.isDevelopment = supabaseUrl.includes('placeholder') || supabaseKey === 'placeholder-key';
        if (!this.isDevelopment) {
            this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        }
    }
    async login(email, password) {
        if (this.isDevelopment) {
            const mockToken = this.generateMockToken(email);
            return {
                access_token: mockToken,
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                email: email,
                user_id: `mock-user-${email.replace('@', '-').replace('.', '-')}`,
            };
        }
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                throw new common_1.UnauthorizedException('Credenciais inválidas');
            }
            if (!data.user || !data.session) {
                throw new common_1.UnauthorizedException('Falha na autenticação');
            }
            return {
                access_token: data.session.access_token,
                expires_at: new Date(data.session.expires_at * 1000).toISOString(),
                email: data.user.email,
                user_id: data.user.id,
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Erro interno de autenticação');
        }
    }
    async register(email, password) {
        if (this.isDevelopment) {
            const mockToken = this.generateMockToken(email);
            return {
                access_token: mockToken,
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                email: email,
                user_id: `mock-user-${email.replace('@', '-').replace('.', '-')}`,
            };
        }
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password,
            });
            if (error) {
                throw new common_1.UnauthorizedException('Erro no registro: ' + error.message);
            }
            if (!data.user) {
                throw new common_1.UnauthorizedException('Falha no registro');
            }
            if (!data.session) {
                throw new common_1.UnauthorizedException('Confirme seu email antes de fazer login');
            }
            return {
                access_token: data.session.access_token,
                expires_at: new Date(data.session.expires_at * 1000).toISOString(),
                email: data.user.email,
                user_id: data.user.id,
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Erro interno no registro');
        }
    }
    async verifyToken(token) {
        if (this.isDevelopment) {
            const mockData = this.parseMockToken(token);
            if (!mockData) {
                throw new common_1.UnauthorizedException('Token inválido');
            }
            return mockData;
        }
        try {
            const { data, error } = await this.supabase.auth.getUser(token);
            if (error || !data.user) {
                throw new common_1.UnauthorizedException('Token inválido');
            }
            return {
                user_id: data.user.id,
                email: data.user.email,
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Erro na verificação do token');
        }
    }
    generateMockToken(email) {
        const payload = {
            sub: `mock-user-${email.replace('@', '-').replace('.', '-')}`,
            email: email,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
        };
        return `mock.${Buffer.from(JSON.stringify(payload)).toString('base64')}.signature`;
    }
    parseMockToken(token) {
        try {
            if (!token.startsWith('mock.')) {
                return null;
            }
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
                return null;
            }
            return {
                user_id: payload.sub,
                email: payload.email,
            };
        }
        catch {
            return null;
        }
    }
};
exports.SupabaseAuthService = SupabaseAuthService;
exports.SupabaseAuthService = SupabaseAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseAuthService);
//# sourceMappingURL=supabase-auth.service.js.map