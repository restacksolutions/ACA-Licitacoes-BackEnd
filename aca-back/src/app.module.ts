import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // Carrega variáveis de ambiente e as torna globais
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
