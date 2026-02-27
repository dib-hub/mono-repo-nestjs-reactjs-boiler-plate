import { PrismaClient } from '../src/lib/generated/client/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Example: Create a default admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: 'hashed-password-here', // In real app, hash the password
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
