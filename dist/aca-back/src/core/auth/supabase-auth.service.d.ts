import { ConfigService } from '@nestjs/config';
export declare class SupabaseAuthService {
    private configService;
    private supabase;
    private isDevelopment;
    constructor(configService: ConfigService);
    login(email: string, password: string): Promise<{
        access_token: any;
        expires_at: string;
        email: any;
        user_id: any;
    }>;
    register(email: string, password: string): Promise<{
        access_token: any;
        expires_at: string;
        email: any;
        user_id: any;
    }>;
    verifyToken(token: string): Promise<{
        user_id: any;
        email: any;
    }>;
    private generateMockToken;
    private parseMockToken;
}
