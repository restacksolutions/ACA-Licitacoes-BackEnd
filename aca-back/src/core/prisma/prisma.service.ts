import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query','warn','error'] : ['error'],
    });
  }
  async onModuleInit() { await this.$connect(); }
  async enableShutdownHooks(app: INestApplication) {
    // Shutdown hook será implementado quando necessário
    // this.$on('beforeExit', async () => { await app.close(); });
  }
}
