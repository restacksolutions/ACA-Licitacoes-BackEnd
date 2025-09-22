"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvSchema = void 0;
const zod_1 = require("zod");
exports.EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().default(3000),
    DATABASE_URL: zod_1.z.string().url().optional().default('postgresql://postgres:password@localhost:5432/aca_licitacoes'),
    SUPABASE_JWKS_URL: zod_1.z.string().url().optional(),
    SUPABASE_PROJECT_URL: zod_1.z.string().url().optional(),
    SUPABASE_ANON_KEY: zod_1.z.string().min(20).optional(),
    SUPABASE_SERVICE_ROLE: zod_1.z.string().min(20).optional(),
    SUPABASE_STORAGE_BUCKET: zod_1.z.string().default('docs'),
    SWAGGER_TITLE: zod_1.z.string().default('ACA Licitações API'),
    SWAGGER_VERSION: zod_1.z.string().default('1.0'),
});
//# sourceMappingURL=env.validation.js.map