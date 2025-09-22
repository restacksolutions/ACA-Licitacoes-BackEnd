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
const companies_service_1 = require("./companies.service");
const company_dto_1 = require("./dto/company.dto");
const jwt_auth_guard_1 = require("../../core/security/jwt-auth.guard");
const company_guard_1 = require("../../core/tenancy/company.guard");
const roles_guard_1 = require("../../core/security/roles.guard");
const roles_decorator_1 = require("../../core/security/roles.decorator");
const current_user_decorator_1 = require("../../core/security/current-user.decorator");
let CompaniesController = class CompaniesController {
    constructor(companiesService) {
        this.companiesService = companiesService;
    }
    async findOne(companyId) {
        return this.companiesService.findById(companyId);
    }
    async update(companyId, updateDto, user) {
        return this.companiesService.update(companyId, updateDto, user.userId);
    }
};
exports.CompaniesController = CompaniesController;
__decorate([
    (0, common_1.Get)(':companyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get company details' }),
    (0, swagger_1.ApiParam)({ name: 'companyId', description: 'Company ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Company details retrieved successfully', type: company_dto_1.CompanyResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Company not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied' }),
    __param(0, (0, common_1.Param)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':companyId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('owner', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update company details' }),
    (0, swagger_1.ApiParam)({ name: 'companyId', description: 'Company ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Company updated successfully', type: company_dto_1.CompanyResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Company not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, company_dto_1.UpdateCompanyDto, Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "update", null);
exports.CompaniesController = CompaniesController = __decorate([
    (0, swagger_1.ApiTags)('Companies'),
    (0, common_1.Controller)('companies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_guard_1.CompanyGuard),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    __metadata("design:paramtypes", [companies_service_1.CompaniesService])
], CompaniesController);
//# sourceMappingURL=companies.controller.js.map