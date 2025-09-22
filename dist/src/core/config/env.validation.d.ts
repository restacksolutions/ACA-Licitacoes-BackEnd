import { z } from 'zod';
export declare const envValidationSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    PORT: z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>;
    DATABASE_URL: z.ZodString;
    JWT_ACCESS_SECRET: z.ZodString;
    JWT_REFRESH_SECRET: z.ZodString;
    JWT_ACCESS_EXPIRES: z.ZodDefault<z.ZodString>;
    JWT_REFRESH_EXPIRES: z.ZodDefault<z.ZodString>;
    SWAGGER_TITLE: z.ZodDefault<z.ZodString>;
    SWAGGER_VERSION: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV?: "development" | "test" | "production";
    PORT?: number;
    DATABASE_URL?: string;
    SWAGGER_TITLE?: string;
    SWAGGER_VERSION?: string;
    JWT_ACCESS_SECRET?: string;
    JWT_REFRESH_SECRET?: string;
    JWT_ACCESS_EXPIRES?: string;
    JWT_REFRESH_EXPIRES?: string;
}, {
    NODE_ENV?: "development" | "test" | "production";
    PORT?: string;
    DATABASE_URL?: string;
    SWAGGER_TITLE?: string;
    SWAGGER_VERSION?: string;
    JWT_ACCESS_SECRET?: string;
    JWT_REFRESH_SECRET?: string;
    JWT_ACCESS_EXPIRES?: string;
    JWT_REFRESH_EXPIRES?: string;
}>;
export type EnvConfig = z.infer<typeof envValidationSchema>;
