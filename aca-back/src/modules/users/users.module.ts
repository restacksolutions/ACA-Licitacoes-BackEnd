import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtStrategy } from '../../core/security/jwt.strategy';
import { SupabaseAuthService } from '../../core/auth/supabase-auth.service';
@Module({ providers: [UsersService, JwtStrategy, SupabaseAuthService], controllers: [UsersController] })
export class UsersModule {}
