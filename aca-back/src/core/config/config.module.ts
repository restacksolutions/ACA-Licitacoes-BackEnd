import { Module } from '@nestjs/common';
import { ConfigModule as NestConfig } from '@nestjs/config';
import { EnvSchema } from './env.validation';

@Module({
  imports: [
    NestConfig.forRoot({
      isGlobal: true,
      validate: (env) => EnvSchema.parse(env),
    }),
  ],
})
export class ConfigModule {}
