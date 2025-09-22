import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ArgonAdapter } from '../../adapters/hashing/argon.adapter';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ArgonAdapter],
  exports: [AuthService],
})
export class AuthModule {}
