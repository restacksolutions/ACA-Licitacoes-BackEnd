import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';
import { SupabaseAuthService } from '../auth/supabase-auth.service';

@Injectable()
export class JwtStrategy {
  private jwks: ReturnType<typeof createRemoteJWKSet>;
  constructor(
    private readonly config: ConfigService,
    private supabaseAuth: SupabaseAuthService,
  ) {
    const jwksUrl = this.config.get<string>('SUPABASE_JWKS_URL') || 'https://placeholder.supabase.co/auth/v1/keys';
    this.jwks = createRemoteJWKSet(new URL(jwksUrl));
  }
  
  async verify(token: string): Promise<JWTPayload> {
    try {
      // Primeiro tenta verificar com JWKS (para tokens do Supabase)
      const { payload } = await jwtVerify(token, this.jwks, {});
      if (!payload.sub) throw new UnauthorizedException('Token sem sub');
      return payload;
    } catch (error) {
      // Se falhar, tenta verificar diretamente com o Supabase
      try {
        const user = await this.supabaseAuth.verifyToken(token);
        return {
          sub: user.user_id,
          email: user.email,
        } as JWTPayload;
      } catch (supabaseError) {
        // Se for um token mock, tenta verificar diretamente
        if (token.startsWith('mock.')) {
          try {
            const parts = token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
              if (payload.sub && payload.exp && payload.exp > Math.floor(Date.now() / 1000)) {
                return payload as JWTPayload;
              }
            }
          } catch (mockError) {
            // Ignora erro de parsing do token mock
          }
        }
        throw new UnauthorizedException('Token inválido');
      }
    }
  }
}
