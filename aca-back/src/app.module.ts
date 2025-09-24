import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from './core/config/config.module';
import { LoggerModule } from './core/logger/logger.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { JwtStrategy } from './core/security/jwt.strategy';
import { JwtAuthGuard } from './core/security/jwt-auth.guard';
import { SupabaseAuthService } from './core/auth/supabase-auth.service';

import { SupabaseStorage } from './adapters/storage/supabase.storage';

import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { MembersModule } from './modules/members/members.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { LicitacaoDocumentsModule } from './modules/licitacao-documents/licitacao-documents.module';
import { BidsModule } from './modules/bids/bids.module';
import { BidDocsModule } from './modules/bid-docs/bid-docs.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { CommentsModule } from './modules/comments/comments.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    MembersModule,
    DocumentsModule,
    LicitacaoDocumentsModule,
    BidsModule,
    BidDocsModule,
    WorkflowModule,
    CommentsModule,
    AuditModule,
  ],
  providers: [
    JwtStrategy,
    SupabaseAuthService,
    SupabaseStorage,
    { provide: APP_GUARD, useClass: JwtAuthGuard }, // protege tudo por padrão
  ],
})
export class AppModule {}
