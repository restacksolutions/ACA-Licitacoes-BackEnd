import { Module } from '@nestjs/common';
import { LicitacoesController } from './licitacoes.controller';
import { LicitacoesService } from './licitacoes.service';
import { PrismaService } from '../../common/utils/prisma.service';
import { LicitacoesUploadController } from './licitacoes.upload.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [LicitacoesController, LicitacoesUploadController],
  providers: [LicitacoesService, PrismaService],
})
export class LicitacoesModule {}
