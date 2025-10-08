import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { PrismaService } from '../../common/utils/prisma.service';

@Module({
  imports: [JwtModule],
  controllers: [MembersController],
  providers: [MembersService, PrismaService],
})
export class MembersModule {}
