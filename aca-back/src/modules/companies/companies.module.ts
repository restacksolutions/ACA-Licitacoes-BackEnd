import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { UserHelper } from '../../core/security/user-helper.service';
import { JwtStrategy } from '../../core/security/jwt.strategy';
import { SupabaseAuthService } from '../../core/auth/supabase-auth.service';
import { DocumentsService } from '../documents/documents.service';
import { SupabaseStorage } from '../../adapters/storage/supabase.storage';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({ 
  imports: [PrismaModule],
  providers: [CompaniesService, UserHelper, JwtStrategy, SupabaseAuthService, DocumentsService, SupabaseStorage], 
  controllers: [CompaniesController] 
})
export class CompaniesModule {}
