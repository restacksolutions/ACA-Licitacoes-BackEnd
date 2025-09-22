import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './core/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE || 'ACA Licitações API')
    .setVersion(process.env.SWAGGER_VERSION || '1.0')
    .setDescription('API para sistema de licitações multi-tenant com autenticação JWT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Prisma shutdown hooks
  const prisma = app.get(PrismaService);
  await prisma.enableShutdownHooks(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/docs`);
}

bootstrap();
