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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../core/security/jwt-auth.guard");
const company_guard_1 = require("../../core/tenancy/company.guard");
const roles_guard_1 = require("../../core/security/roles.guard");
const roles_decorator_1 = require("../../core/security/roles.decorator");
const current_user_decorator_1 = require("../../core/security/current-user.decorator");
const current_company_decorator_1 = require("../../core/tenancy/current-company.decorator");
const companies_service_1 = require("./companies.service");
const company_dto_1 = require("./dto/company.dto");
const user_helper_service_1 = require("../../core/security/user-helper.service");
let CompaniesController = class CompaniesController {
    constructor(svc, userHelper) {
        this.svc = svc;
        this.userHelper = userHelper;
    }
    async myCompanies(user) {
        return this.svc.myCompanies(user.authUserId);
    }
    async create(dto, user) {
        const userId = await this.userHelper.internalUserId(user.authUserId);
        if (!userId)
            throw new common_1.NotFoundException('Usuário não encontrado no sistema');
        return this.svc.create(dto, userId);
    }
    async get(companyId, _ctx) {
        return this.svc.getById(companyId);
    }
    async update(companyId, dto) {
        return this.svc.update(companyId, dto);
    }
};
exports.CompaniesController = CompaniesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "myCompanies", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_dto_1.CreateCompanyDto, Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(company_guard_1.CompanyGuard),
    (0, common_1.Get)(':companyId'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, current_company_decorator_1.CurrentCompany)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "get", null);
__decorate([
    (0, common_1.UseGuards)(company_guard_1.CompanyGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('owner', 'admin'),
    (0, common_1.Patch)(':companyId'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, company_dto_1.UpdateCompanyDto]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "update", null);
exports.CompaniesController = CompaniesController = __decorate([
    (0, swagger_1.ApiTags)('Companies'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('companies'),
    __metadata("design:paramtypes", [companies_service_1.CompaniesService,
        user_helper_service_1.UserHelper])
], CompaniesController);
//# sourceMappingURL=companies.controller.js.map