import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { JwtStrategy } from '../../core/security/jwt.strategy';
import { SupabaseAuthService } from '../../core/auth/supabase-auth.service';

@Module({ providers: [BidsService, JwtStrategy, SupabaseAuthService], controllers: [BidsController] })
export class BidsModule {}
