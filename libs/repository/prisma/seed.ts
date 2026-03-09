import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../src/lib/generated/client/client';

const logger = new Logger('Seed');
const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  logger.log('🌱 Seeding database...');
  const password = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      password,
      role: 'ADMIN',
    },
  });

  logger.log(`✅ Seeded: ${JSON.stringify({ admin })}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    logger.log('✅ Seeding complete');
  })
  .catch(async (e) => {
    logger.error(`❌ Seeding failed: ${e}`);
    await prisma.$disconnect();
    process.exit(1);
  });
