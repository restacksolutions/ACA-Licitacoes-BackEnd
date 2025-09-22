import { z } from 'zod';
export declare const EnvSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        test: "test";
        production: "production";
    }>>;
    PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    DATABASE_URL: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    SUPABASE_JWKS_URL: z.ZodOptional<z.ZodString>;
    SUPABASE_PROJECT_URL: z.ZodOptional<z.ZodString>;
    SUPABASE_ANON_KEY: z.ZodOptional<z.ZodString>;
    SUPABASE_SERVICE_ROLE: z.ZodOptional<z.ZodString>;
    SUPABASE_STORAGE_BUCKET: z.ZodDefault<z.ZodString>;
    SWAGGER_TITLE: z.ZodDefault<z.ZodString>;
    SWAGGER_VERSION: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type Env = z.infer<typeof EnvSchema>;
