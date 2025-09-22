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
exports.CompanyResponseDto = exports.UpdateCompanyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateCompanyDto {
}
exports.UpdateCompanyDto = UpdateCompanyDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Empresa Atualizada' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '11.222.333/0001-44' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "cnpj", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '(11) 99999-9999' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Rua das Flores, 123' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCompanyDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCompanyDto.prototype, "active", void 0);
class CompanyResponseDto {
}
exports.CompanyResponseDto = CompanyResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Empresa da Alice' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '00.000.000/0001-00' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "cnpj", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '(11) 99999-9999' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Rua das Flores, 123' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'path/to/logo.png' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "logoPath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'path/to/letterhead.png' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "letterheadPath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], CompanyResponseDto.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-09-22T20:30:00.000Z' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-09-22T20:30:00.000Z' }),
    __metadata("design:type", String)
], CompanyResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=company.dto.js.map