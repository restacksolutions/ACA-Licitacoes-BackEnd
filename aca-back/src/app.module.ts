import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { MembersModule } from './modules/members/members.module';

@Module({
  imports: [
    // Carrega variáveis de ambiente e as torna globais
    AuthModule,
    CompaniesModule,
    MembersModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
