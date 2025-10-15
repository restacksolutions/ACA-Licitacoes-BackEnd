// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do CORS
  app.enableCors({
    origin: [
      'http://localhost:4200',  // Angular dev server
      'http://127.0.0.1:4200', // Angular dev server (alternativo)
      'http://localhost:3000',  // Swagger UI
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Company-Id',
    ],
  });

  const config = new DocumentBuilder()
    .setTitle('ACA Licitações API')
    .setDescription('API da plataforma')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'refresh',
    )
    .addApiKey(
      { type: 'apiKey', name: 'X-Company-Id', in: 'header' },
      'company-id',
    )
    .build();

  // NÃO filtrar módulos aqui (veja item 3)
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true, // importante quando usa RouterModule/lazy modules
  });

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(3000);
}
bootstrap();
