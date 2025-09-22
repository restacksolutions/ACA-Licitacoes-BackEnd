"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesModule = void 0;
const common_1 = require("@nestjs/common");
const companies_service_1 = require("./companies.service");
const companies_controller_1 = require("./companies.controller");
const user_helper_service_1 = require("../../core/security/user-helper.service");
const jwt_strategy_1 = require("../../core/security/jwt.strategy");
const supabase_auth_service_1 = require("../../core/auth/supabase-auth.service");
let CompaniesModule = class CompaniesModule {
};
exports.CompaniesModule = CompaniesModule;
exports.CompaniesModule = CompaniesModule = __decorate([
    (0, common_1.Module)({
        providers: [companies_service_1.CompaniesService, user_helper_service_1.UserHelper, jwt_strategy_1.JwtStrategy, supabase_auth_service_1.SupabaseAuthService],
        controllers: [companies_controller_1.CompaniesController]
    })
], CompaniesModule);
//# sourceMappingURL=companies.module.js.map