import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UserHelper {
  constructor(private prisma: PrismaService) {}
  async internalUserId(authUserId: string) {
    const u = await this.prisma.appUser.findUnique({ where: { authUserId } });
    return u?.id;
  }
}
