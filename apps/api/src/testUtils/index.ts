import { randomUUID } from 'crypto';
import { resolve } from 'path';
import { PrismaService } from '@my-monorepo/database';
import { config as loadEnv } from 'dotenv';

interface SeededTestUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface SeededTestProfile {
  id: string;
  name: string;
  email: string;
  linkedInUrl: string | null;
  githubUrl: string | null;
  userId: string;
}

interface TestProfileSeed {
  user: SeededTestUser;
  profile: SeededTestProfile;
}

export function loadTestDatabaseEnv(): void {
  loadEnv({ path: resolve(process.cwd(), '.env') });
  loadEnv({ path: resolve(process.cwd(), 'apps/api/.env') });
  loadEnv({ path: resolve(process.cwd(), 'libs/repository/.env') });

  const testDatabaseUrl = process.env['TEST_DATABASE_URL'];

  if (!testDatabaseUrl) {
    throw new Error('TEST_DATABASE_URL must be set for DB-backed module tests');
  }

  process.env['DATABASE_URL'] = testDatabaseUrl;
}

export async function createTestUser(prisma: PrismaService): Promise<SeededTestUser> {
  const suffix = randomUUID();
  const email = `controller-test-${suffix}@example.com`;

  return await prisma.user.create({
    data: {
      email,
      firstName: 'Controller',
      lastName: 'Test',
      password: 'plain-text-for-tests-only',
      role: 'USER',
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  });
}

export async function createTestProfile(prisma: PrismaService): Promise<TestProfileSeed> {
  const user = await createTestUser(prisma);

  const profile = await prisma.profile.create({
    data: {
      name: 'Controller Test Profile',
      email: user.email,
      linkedInUrl: 'https://linkedin.com/in/controller-test-profile',
      githubUrl: 'https://github.com/controller-test-profile',
      userId: user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      linkedInUrl: true,
      githubUrl: true,
      userId: true,
    },
  });

  return { user, profile };
}

export async function cleanupTestUser(prisma: PrismaService, userId: string): Promise<void> {
  await prisma.user.deleteMany({
    where: { id: userId },
  });
}
