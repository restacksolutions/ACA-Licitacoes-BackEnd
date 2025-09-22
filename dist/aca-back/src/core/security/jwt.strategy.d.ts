import { ConfigService } from '@nestjs/config';
import { JWTPayload } from 'jose';
import { SupabaseAuthService } from '../auth/supabase-auth.service';
export declare class JwtStrategy {
    private readonly config;
    private supabaseAuth;
    private jwks;
    constructor(config: ConfigService, supabaseAuth: SupabaseAuthService);
    verify(token: string): Promise<JWTPayload>;
}
