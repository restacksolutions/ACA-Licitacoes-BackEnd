import { Module } from '@nestjs/common';
import { LicitacaoDocumentsController } from './licitacao-documents.controller';
import { LicitacaoDocumentsService } from './licitacao-documents.service';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { JwtStrategy } from '../../core/security/jwt.strategy';
import { SupabaseAuthService } from '../../core/auth/supabase-auth.service';

@Module({
  imports: [PrismaModule],
  controllers: [LicitacaoDocumentsController],
  providers: [LicitacaoDocumentsService, JwtStrategy, SupabaseAuthService],
  exports: [LicitacaoDocumentsService],
})
export class LicitacaoDocumentsModule {}
