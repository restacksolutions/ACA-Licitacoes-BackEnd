import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { envValidationSchema } from './env.validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const result = envValidationSchema.safeParse(config);
        if (!result.success) {
          throw new Error(`Environment validation failed: ${result.error.message}`);
        }
        return result.data;
      },
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
