import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CompanyDocsController } from './company-docs.controller';
import { CompanyDocsService } from './company-docs.service';
import { PrismaService } from '../../common/utils/prisma.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [CompanyDocsController],
  providers: [CompanyDocsService, PrismaService],
})
export class CompanyDocsModule {}
