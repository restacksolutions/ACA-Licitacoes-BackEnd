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
exports.SupabaseStorage = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = require("@nestjs/config");
let SupabaseStorage = class SupabaseStorage {
    constructor(config) {
        this.config = config;
        const projectUrl = this.config.get('SUPABASE_PROJECT_URL') || 'https://placeholder.supabase.co';
        const serviceRole = this.config.get('SUPABASE_SERVICE_ROLE') || 'placeholder-service-role';
        this.client = (0, supabase_js_1.createClient)(projectUrl, serviceRole);
        this.bucket = this.config.get('SUPABASE_STORAGE_BUCKET') || 'docs';
    }
    async uploadObject(path, data, contentType) {
        const { error } = await this.client.storage.from(this.bucket).upload(path, data, { contentType, upsert: true });
        if (error)
            throw error;
        return { path };
    }
    getPublicUrl(path) {
        const { data } = this.client.storage.from(this.bucket).getPublicUrl(path);
        return data.publicUrl;
    }
};
exports.SupabaseStorage = SupabaseStorage;
exports.SupabaseStorage = SupabaseStorage = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseStorage);
//# sourceMappingURL=supabase.storage.js.map