import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAuthService {
  private supabase;
  private isDevelopment: boolean;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_PROJECT_URL') || 'https://placeholder.supabase.co';
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY') || 'placeholder-key';
    
    this.isDevelopment = supabaseUrl.includes('placeholder') || supabaseKey === 'placeholder-key';
    
    if (!this.isDevelopment) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  async login(email: string, password: string) {
    // Modo de desenvolvimento - autenticação mock
    if (this.isDevelopment) {
      // Para desenvolvimento, aceita qualquer email/senha
      const mockToken = this.generateMockToken(email);
      return {
        access_token: mockToken,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
        email: email,
        user_id: `mock-user-${email.replace('@', '-').replace('.', '-')}`,
      };
    }

    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      if (!data.user || !data.session) {
        throw new UnauthorizedException('Falha na autenticação');
      }

      return {
        access_token: data.session.access_token,
        expires_at: new Date(data.session.expires_at! * 1000).toISOString(),
        email: data.user.email!,
        user_id: data.user.id,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Erro interno de autenticação');
    }
  }

  async verifyToken(token: string) {
    // Modo de desenvolvimento - verificação mock
    if (this.isDevelopment) {
      const mockData = this.parseMockToken(token);
      if (!mockData) {
        throw new UnauthorizedException('Token inválido');
      }
      return mockData;
    }

    try {
      const { data, error } = await this.supabase.auth.getUser(token);
      
      if (error || !data.user) {
        throw new UnauthorizedException('Token inválido');
      }

      return {
        user_id: data.user.id,
        email: data.user.email,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Erro na verificação do token');
    }
  }

  private generateMockToken(email: string): string {
    // Gera um token mock simples para desenvolvimento
    const payload = {
      sub: `mock-user-${email.replace('@', '-').replace('.', '-')}`,
      email: email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 horas
    };
    
    // Token JWT mock simples (não é um JWT real, mas funciona para desenvolvimento)
    return `mock.${Buffer.from(JSON.stringify(payload)).toString('base64')}.signature`;
  }

  private parseMockToken(token: string): { user_id: string; email: string } | null {
    try {
      if (!token.startsWith('mock.')) {
        return null;
      }
      
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      
      // Verifica se o token não expirou
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }
      
      return {
        user_id: payload.sub,
        email: payload.email,
      };
    } catch {
      return null;
    }
  }
}
