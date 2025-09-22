import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { JwtStrategy } from '../../core/security/jwt.strategy';
import { SupabaseAuthService } from '../../core/auth/supabase-auth.service';

@Module({ providers: [MembersService, JwtStrategy, SupabaseAuthService], controllers: [MembersController] })
export class MembersModule {}
