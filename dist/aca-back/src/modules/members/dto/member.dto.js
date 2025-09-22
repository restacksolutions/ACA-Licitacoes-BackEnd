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
exports.MemberResponseDto = exports.UpdateMemberRoleDto = exports.InviteMemberDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class InviteMemberDto {
}
exports.InviteMemberDto = InviteMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'usuario@example.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], InviteMemberDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['owner', 'admin', 'member'], example: 'member' }),
    (0, class_validator_1.IsIn)(['owner', 'admin', 'member']),
    __metadata("design:type", String)
], InviteMemberDto.prototype, "role", void 0);
class UpdateMemberRoleDto {
}
exports.UpdateMemberRoleDto = UpdateMemberRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['owner', 'admin', 'member'], example: 'admin' }),
    (0, class_validator_1.IsIn)(['owner', 'admin', 'member']),
    __metadata("design:type", String)
], UpdateMemberRoleDto.prototype, "role", void 0);
class MemberResponseDto {
}
exports.MemberResponseDto = MemberResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], MemberResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['owner', 'admin', 'member'], example: 'member' }),
    __metadata("design:type", String)
], MemberResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    __metadata("design:type", String)
], MemberResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'João Silva' }),
    __metadata("design:type", String)
], MemberResponseDto.prototype, "userFullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'joao@example.com' }),
    __metadata("design:type", String)
], MemberResponseDto.prototype, "userEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-09-22T20:30:00.000Z' }),
    __metadata("design:type", String)
], MemberResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=member.dto.js.map