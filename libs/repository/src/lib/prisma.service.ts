import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from './generated/client/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] });
    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    console.log('✅ Database connected');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    console.log('🔌 Database disconnected');
  }
}
