import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { MembersModule } from './modules/members/members.module';
import { CompanyDocsModule } from './modules/company-docs/company-docs.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';

@Module({
  imports: [
    // Carrega variáveis de ambiente e as torna globais
    AuthModule,
    CompaniesModule,
    MembersModule,
    CompanyDocsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    VehiclesModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
