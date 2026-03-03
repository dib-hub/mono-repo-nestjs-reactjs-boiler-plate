import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../src/lib/generated/client/client';

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  console.log('🌱 Seeding database...');
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

  console.log('✅ Seeded:', { admin });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('✅ Seeding complete');
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
