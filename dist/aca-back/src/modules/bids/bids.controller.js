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
exports.BidsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../core/security/jwt-auth.guard");
const company_guard_1 = require("../../core/tenancy/company.guard");
const roles_guard_1 = require("../../core/security/roles.guard");
const roles_decorator_1 = require("../../core/security/roles.decorator");
const bids_service_1 = require("./bids.service");
const bid_dto_1 = require("./dto/bid.dto");
let BidsController = class BidsController {
    constructor(svc) {
        this.svc = svc;
    }
    list(companyId) {
        return this.svc.list(companyId);
    }
    create(companyId, dto) {
        return this.svc.create(companyId, dto);
    }
    get(companyId, bidId) {
        return this.svc.get(companyId, bidId);
    }
    update(companyId, bidId, dto) {
        return this.svc.update(companyId, bidId, dto);
    }
    remove(bidId) {
        return this.svc.remove(bidId);
    }
};
exports.BidsController = BidsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "list", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('owner', 'admin'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bid_dto_1.CreateBidDto]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':bidId'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('bidId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "get", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('owner', 'admin'),
    (0, common_1.Patch)(':bidId'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('bidId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('owner', 'admin'),
    (0, common_1.Delete)(':bidId'),
    __param(0, (0, common_1.Param)('bidId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BidsController.prototype, "remove", null);
exports.BidsController = BidsController = __decorate([
    (0, swagger_1.ApiTags)('Bids'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, company_guard_1.CompanyGuard),
    (0, common_1.Controller)('companies/:companyId/bids'),
    __metadata("design:paramtypes", [bids_service_1.BidsService])
], BidsController);
//# sourceMappingURL=bids.controller.js.map