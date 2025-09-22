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
exports.BidResponseDto = exports.UpdateBidDto = exports.CreateBidDto = exports.LicitacaoStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var LicitacaoStatus;
(function (LicitacaoStatus) {
    LicitacaoStatus["draft"] = "draft";
    LicitacaoStatus["open"] = "open";
    LicitacaoStatus["closed"] = "closed";
    LicitacaoStatus["cancelled"] = "cancelled";
    LicitacaoStatus["awarded"] = "awarded";
})(LicitacaoStatus || (exports.LicitacaoStatus = LicitacaoStatus = {}));
class CreateBidDto {
}
exports.CreateBidDto = CreateBidDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Licitação para Fornecimento de Equipamentos' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBidDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Prefeitura Municipal de São Paulo' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBidDto.prototype, "orgao", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Pregão Eletrônico' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBidDto.prototype, "modalidade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/edital.pdf' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBidDto.prototype, "editalUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-10-15T14:00:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBidDto.prototype, "sessionAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-10-10T18:00:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBidDto.prototype, "submissionDeadline", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: LicitacaoStatus, example: LicitacaoStatus.draft }),
    (0, class_validator_1.IsEnum)(LicitacaoStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBidDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '150000.50' }),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBidDto.prototype, "saleValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Observações importantes sobre a licitação' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBidDto.prototype, "notes", void 0);
class UpdateBidDto {
}
exports.UpdateBidDto = UpdateBidDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Licitação para Fornecimento de Equipamentos' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBidDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Prefeitura Municipal de São Paulo' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBidDto.prototype, "orgao", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Pregão Eletrônico' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBidDto.prototype, "modalidade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/edital.pdf' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBidDto.prototype, "editalUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-10-15T14:00:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBidDto.prototype, "sessionAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-10-10T18:00:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBidDto.prototype, "submissionDeadline", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: LicitacaoStatus, example: LicitacaoStatus.open }),
    (0, class_validator_1.IsEnum)(LicitacaoStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBidDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '150000.50' }),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBidDto.prototype, "saleValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Observações importantes sobre a licitação' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBidDto.prototype, "notes", void 0);
class BidResponseDto {
}
exports.BidResponseDto = BidResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], BidResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Licitação para Fornecimento de Equipamentos' }),
    __metadata("design:type", String)
], BidResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Prefeitura Municipal de São Paulo' }),
    __metadata("design:type", String)
], BidResponseDto.prototype, "orgao", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Pregão Eletrônico' }),
    __metadata("design:type", String)
], BidResponseDto.prototype, "modalidade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/edital.pdf' }),
    __metadata("design:type", String)
], BidResponseDto.prototype, "editalUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-10-15T14:00:00.000Z' }),
    __metadata("design:type", String)
], BidResponseDto.prototype, "sessionAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-10-10T18:00:00.000Z' }),
    __metadata("design:type", String)
], BidResponseDto.prototype, "submissionDeadline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: LicitacaoStatus, example: LicitacaoStatus.draft }),
    __metadata("design:type", String)
], BidResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '150000.50' }),
    __metadata("design:type", String)
], BidResponseDto.prototype, "saleValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Observações importantes sobre a licitação' }),
    __metadata("design:type", String)
], BidResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-09-22T20:30:00.000Z' }),
    __metadata("design:type", String)
], BidResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-09-22T20:30:00.000Z' }),
    __metadata("design:type", String)
], BidResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=bid.dto.js.map