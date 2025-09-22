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
exports.CompanyDocResponseDto = exports.UpdateCompanyDocDto = exports.CreateCompanyDocDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateCompanyDocDto {
}
exports.CreateCompanyDocDto = CreateCompanyDocDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CNPJ' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyDocDto.prototype, "docType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '12.345.678/0001-90' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCompanyDocDto.prototype, "docNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Receita Federal' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCompanyDocDto.prototype, "issuer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2020-01-15' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCompanyDocDto.prototype, "issueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2030-01-15' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCompanyDocDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Documento em bom estado' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCompanyDocDto.prototype, "notes", void 0);
class UpdateCompanyDocDto {
}
exports.UpdateCompanyDocDto = UpdateCompanyDocDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'CNPJ' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCompanyDocDto.prototype, "docType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '12.345.678/0001-90' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCompanyDocDto.prototype, "docNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Receita Federal' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCompanyDocDto.prototype, "issuer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2020-01-15' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCompanyDocDto.prototype, "issueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2030-01-15' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCompanyDocDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Documento em bom estado' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCompanyDocDto.prototype, "notes", void 0);
class CompanyDocResponseDto {
}
exports.CompanyDocResponseDto = CompanyDocResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], CompanyDocResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CNPJ' }),
    __metadata("design:type", String)
], CompanyDocResponseDto.prototype, "docType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '12.345.678/0001-90' }),
    __metadata("design:type", String)
], CompanyDocResponseDto.prototype, "docNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Receita Federal' }),
    __metadata("design:type", String)
], CompanyDocResponseDto.prototype, "issuer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2020-01-15' }),
    __metadata("design:type", String)
], CompanyDocResponseDto.prototype, "issueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2030-01-15' }),
    __metadata("design:type", String)
], CompanyDocResponseDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://storage.com/document.pdf' }),
    __metadata("design:type", String)
], CompanyDocResponseDto.prototype, "filePath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Documento em bom estado' }),
    __metadata("design:type", String)
], CompanyDocResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], CompanyDocResponseDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-09-22T20:30:00.000Z' }),
    __metadata("design:type", String)
], CompanyDocResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-09-22T20:30:00.000Z' }),
    __metadata("design:type", String)
], CompanyDocResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=doc.dto.js.map