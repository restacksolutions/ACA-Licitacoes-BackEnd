import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { AuthNewController } from './auth-new.controller';
import { SmokeTestController } from './smoke-test.controller';
import { SupabaseAuthService } from './supabase-auth.service';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthNewController, SmokeTestController],
  providers: [SupabaseAuthService, UserService],
  exports: [SupabaseAuthService, UserService],
})
export class AuthNewModule {}
