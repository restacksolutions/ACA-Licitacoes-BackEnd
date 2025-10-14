import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { PrismaService } from '../../common/utils/prisma.service';

@Module({
  imports: [JwtModule],
  controllers: [VehiclesController],
  providers: [VehiclesService, PrismaService],
})
export class VehiclesModule {}
