import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { SupabaseStorage } from '../../adapters/storage/supabase.storage';
import { JwtStrategy } from '../../core/security/jwt.strategy';
import { SupabaseAuthService } from '../../core/auth/supabase-auth.service';

@Module({ 
  imports: [PrismaModule],
  providers: [DocumentsService, SupabaseStorage, JwtStrategy, SupabaseAuthService], 
  controllers: [DocumentsController] 
})
export class DocumentsModule {}
