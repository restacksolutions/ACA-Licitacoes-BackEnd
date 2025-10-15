import { Module } from '@nestjs/common';
import { CompanyDocsController } from './company-docs.controller';
import { CompanyDocsService } from './company-docs.service';
import { PrismaService } from '../../common/utils/prisma.service';
import { CompanyDocsUploadController } from './company-docs.upload.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CompanyDocsController, CompanyDocsUploadController],
  providers: [CompanyDocsService, PrismaService],
})
export class CompanyDocsModule {}
