"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_module_1 = require("./core/config/config.module");
const logger_module_1 = require("./core/logger/logger.module");
const prisma_module_1 = require("./core/prisma/prisma.module");
const jwt_strategy_1 = require("./core/security/jwt.strategy");
const jwt_auth_guard_1 = require("./core/security/jwt-auth.guard");
const supabase_auth_service_1 = require("./core/auth/supabase-auth.service");
const supabase_storage_1 = require("./adapters/storage/supabase.storage");
const health_module_1 = require("./health/health.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const companies_module_1 = require("./modules/companies/companies.module");
const members_module_1 = require("./modules/members/members.module");
const documents_module_1 = require("./modules/documents/documents.module");
const bids_module_1 = require("./modules/bids/bids.module");
const bid_docs_module_1 = require("./modules/bid-docs/bid-docs.module");
const workflow_module_1 = require("./modules/workflow/workflow.module");
const comments_module_1 = require("./modules/comments/comments.module");
const audit_module_1 = require("./modules/audit/audit.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.ConfigModule,
            logger_module_1.LoggerModule,
            prisma_module_1.PrismaModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            companies_module_1.CompaniesModule,
            members_module_1.MembersModule,
            documents_module_1.DocumentsModule,
            bids_module_1.BidsModule,
            bid_docs_module_1.BidDocsModule,
            workflow_module_1.WorkflowModule,
            comments_module_1.CommentsModule,
            audit_module_1.AuditModule,
        ],
        providers: [
            jwt_strategy_1.JwtStrategy,
            supabase_auth_service_1.SupabaseAuthService,
            supabase_storage_1.SupabaseStorage,
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map