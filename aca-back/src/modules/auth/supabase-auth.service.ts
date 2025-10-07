import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAuthService {
  private supabase: SupabaseClient;

  constructor() {
    // Usar as variáveis de ambiente do Supabase
    const supabaseUrl = process.env.SUPABASE_URL || 'https://gpoerydbnxvtlifmwtyb.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwb2VyeWRibnh2dGxpZm13dHliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMTY1NDIsImV4cCI6MjA3MjY5MjU0Mn0.gbSwoeTmY5Myn0XwBGViYZVPVgRqIpsl5aouNffNsCs';
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async signUp(email: string, password: string, fullName: string, companyName: string) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company_name: companyName,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      throw new Error(`Erro ao fazer login: ${error.message}`);
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      return { success: true };
    } catch (error) {
      throw new Error(`Erro ao fazer logout: ${error.message}`);
    }
  }

  async getUser(accessToken: string) {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser(accessToken);
      
      if (error) {
        throw new Error(error.message);
      }

      return user;
    } catch (error) {
      throw new Error(`Erro ao obter usuário: ${error.message}`);
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const { data, error } = await this.supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        session: data.session,
        user: data.user,
      };
    } catch (error) {
      throw new Error(`Erro ao renovar token: ${error.message}`);
    }
  }
}
