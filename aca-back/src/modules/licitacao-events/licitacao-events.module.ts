import { Module } from '@nestjs/common';
import { LicitacaoEventsController } from './licitacao-events.controller';
import { LicitacaoEventsService } from './licitacao-events.service';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { JwtStrategy } from '../../core/security/jwt.strategy';
import { SupabaseAuthService } from '../../core/auth/supabase-auth.service';

@Module({
  imports: [PrismaModule],
  controllers: [LicitacaoEventsController],
  providers: [LicitacaoEventsService, JwtStrategy, SupabaseAuthService],
  exports: [LicitacaoEventsService],
})
export class LicitacaoEventsModule {}
