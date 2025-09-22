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
exports.UserMeResponseDto = exports.UserPermissionsDto = exports.UserStatsDto = exports.UserRecentActivityDto = exports.UserOwnedCompanyDto = exports.UserMembershipDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UserMembershipDto {
}
exports.UserMembershipDto = UserMembershipDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], UserMembershipDto.prototype, "membershipId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['owner', 'admin', 'member'], example: 'member' }),
    __metadata("design:type", String)
], UserMembershipDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-09-22T20:30:00.000Z' }),
    __metadata("design:type", String)
], UserMembershipDto.prototype, "joinedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Empresa ABC Ltda',
            cnpj: '12.345.678/0001-90',
            phone: '(11) 99999-9999',
            address: 'Rua das Flores, 123',
            logoPath: 'logos/empresa-abc.png',
            letterheadPath: 'letterheads/empresa-abc.png',
            active: true,
            createdAt: '2025-09-22T20:30:00.000Z',
            createdBy: '123e4567-e89b-12d3-a456-426614174000',
            creator: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                fullName: 'João Silva',
                email: 'joao@example.com'
            }
        }
    }),
    __metadata("design:type", Object)
], UserMembershipDto.prototype, "company", void 0);
class UserOwnedCompanyDto {
}
exports.UserOwnedCompanyDto = UserOwnedCompanyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], UserOwnedCompanyDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Empresa ABC Ltda' }),
    __metadata("design:type", String)
], UserOwnedCompanyDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '12.345.678/0001-90' }),
    __metadata("design:type", String)
], UserOwnedCompanyDto.prototype, "cnpj", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '(11) 99999-9999' }),
    __metadata("design:type", String)
], UserOwnedCompanyDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Rua das Flores, 123' }),
    __metadata("design:type", String)
], UserOwnedCompanyDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'logos/empresa-abc.png' }),
    __metadata("design:type", String)
], UserOwnedCompanyDto.prototype, "logoPath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'letterheads/empresa-abc.png' }),
    __metadata("design:type", String)
], UserOwnedCompanyDto.prototype, "letterheadPath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], UserOwnedCompanyDto.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-09-22T20:30:00.000Z' }),
    __metadata("design:type", String)
], UserOwnedCompanyDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], UserOwnedCompanyDto.prototype, "createdBy", void 0);
class UserRecentActivityDto {
}
exports.UserRecentActivityDto = UserRecentActivityDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], UserRecentActivityDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-09-22T20:30:00.000Z' }),
    __metadata("design:type", String)
], UserRecentActivityDto.prototype, "eventAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Status alterado de draft para open' }),
    __metadata("design:type", String)
], UserRecentActivityDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['draft', 'open', 'closed', 'cancelled', 'awarded'], example: 'draft' }),
    __metadata("design:type", String)
], UserRecentActivityDto.prototype, "oldStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['draft', 'open', 'closed', 'cancelled', 'awarded'], example: 'open' }),
    __metadata("design:type", String)
], UserRecentActivityDto.prototype, "newStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Licitação para Fornecimento de Equipamentos',
            status: 'open',
            orgao: 'Prefeitura Municipal',
            modalidade: 'Pregão Eletrônico',
            createdAt: '2025-09-22T20:30:00.000Z',
            company: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'Empresa ABC Ltda'
            }
        }
    }),
    __metadata("design:type", Object)
], UserRecentActivityDto.prototype, "licitacao", void 0);
class UserStatsDto {
}
exports.UserStatsDto = UserStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], UserStatsDto.prototype, "totalMemberships", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], UserStatsDto.prototype, "totalOwnedCompanies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15 }),
    __metadata("design:type", Number)
], UserStatsDto.prototype, "totalEvents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], UserStatsDto.prototype, "activeMemberships", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], UserStatsDto.prototype, "activeOwnedCompanies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], UserStatsDto.prototype, "recentEvents", void 0);
class UserPermissionsDto {
}
exports.UserPermissionsDto = UserPermissionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], UserPermissionsDto.prototype, "canCreateCompanies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], UserPermissionsDto.prototype, "canManageMembers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], UserPermissionsDto.prototype, "canManageDocuments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], UserPermissionsDto.prototype, "canManageBids", void 0);
class UserMeResponseDto {
}
exports.UserMeResponseDto = UserMeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], UserMeResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'auth-user-123' }),
    __metadata("design:type", String)
], UserMeResponseDto.prototype, "authUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'João Silva' }),
    __metadata("design:type", String)
], UserMeResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'joao@example.com' }),
    __metadata("design:type", String)
], UserMeResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-09-22T20:30:00.000Z' }),
    __metadata("design:type", String)
], UserMeResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UserMembershipDto], nullable: true }),
    __metadata("design:type", Array)
], UserMeResponseDto.prototype, "memberships", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UserOwnedCompanyDto], nullable: true }),
    __metadata("design:type", Array)
], UserMeResponseDto.prototype, "ownedCompanies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UserRecentActivityDto], nullable: true }),
    __metadata("design:type", Array)
], UserMeResponseDto.prototype, "recentActivity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserStatsDto }),
    __metadata("design:type", UserStatsDto)
], UserMeResponseDto.prototype, "stats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserPermissionsDto }),
    __metadata("design:type", UserPermissionsDto)
], UserMeResponseDto.prototype, "permissions", void 0);
//# sourceMappingURL=user.dto.js.map