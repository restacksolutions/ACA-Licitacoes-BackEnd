import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../../core/security/jwt.strategy';
import { SupabaseAuthService } from '../../core/auth/supabase-auth.service';

@Module({ providers: [AuthService, JwtStrategy, SupabaseAuthService], controllers: [AuthController] })
export class AuthModule {}
