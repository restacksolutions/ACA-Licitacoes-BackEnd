import { PrismaClient } from '@prisma/client';
import { Injectable, Scope, OnModuleInit } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class PrismaService extends PrismaClient implements OnModuleInit {
  private _companyId: string | null = null;

  setCompanyContext(companyId: string | null) {
    this._companyId = companyId;
  }

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query','warn','error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
