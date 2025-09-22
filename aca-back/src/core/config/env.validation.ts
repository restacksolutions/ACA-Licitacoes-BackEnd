import { z } from 'zod';

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development','test','production']).default('development'),
  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string().url().optional().default('postgresql://postgres:password@localhost:5432/aca_licitacoes'),

  SUPABASE_JWKS_URL: z.string().url().optional(),       // https://<project>.supabase.co/auth/v1/keys
  SUPABASE_PROJECT_URL: z.string().url().optional(),    // https://<project>.supabase.co
  SUPABASE_ANON_KEY: z.string().min(20).optional(),     // chave anônima para autenticação
  SUPABASE_SERVICE_ROLE: z.string().min(20).optional(), // para Storage server-side
  SUPABASE_STORAGE_BUCKET: z.string().default('docs'),

  SWAGGER_TITLE: z.string().default('ACA Licitações API'),
  SWAGGER_VERSION: z.string().default('1.0'),
});

export type Env = z.infer<typeof EnvSchema>;
