import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { LicitacoesService } from './licitacoes.service';
import { LicitacoesController } from './licitacoes.controller';
import { WebhookController } from './webhook.controller';
import { JwtStrategy } from '../../core/security/jwt.strategy';
import { SupabaseAuthService } from '../../core/auth/supabase-auth.service';
import { LicitacaoEventsService } from '../licitacao-events/licitacao-events.service';

@Module({ 
  imports: [HttpModule],
  providers: [BidsService, LicitacoesService, LicitacaoEventsService, JwtStrategy, SupabaseAuthService], 
  controllers: [BidsController, LicitacoesController, WebhookController] 
})
export class BidsModule {}
