/**
 * Test utilities — seed helpers and cleanup routines for integration tests.
 * All functions receive a live PrismaService instance so they run against
 * whatever DATABASE_URL is currently set (the test container when NODE_ENV=test).
 */
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@my-monorepo/database';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SeededTestUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  /** The raw plain-text password that was hashed before insertion. */
  plainPassword: string;
}

export interface SeededTestProfile {
  id: string;
  name: string;
  email: string;
  linkedInUrl: string | null;
  githubUrl: string | null;
  userId: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

/** Re-used across tests that need to call signIn/validateUser. */
export const TEST_USER_PASSWORD = 'Integration1234!';

// ─── Seed helpers ────────────────────────────────────────────────────────────

/**
 * Create a user in the DB.  Password is bcrypt-hashed before insertion.
 * Returns the created row plus the original plain-text password so tests
 * can call signIn without re-hashing.
 */
export async function createTestUser(
  prisma: PrismaService,
  overrides: {
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    role?: 'USER' | 'ADMIN' | 'GUEST';
  } = {}
): Promise<SeededTestUser> {
  const plainPassword = overrides.password ?? TEST_USER_PASSWORD;
  const hashed = await bcrypt.hash(plainPassword, 10);
  const suffix = Date.now();

  const created = await prisma.user.create({
    data: {
      email: overrides.email ?? `test_${suffix}@example.com`,
      firstName: overrides.firstName ?? 'Test',
      lastName: overrides.lastName ?? 'User',
      password: hashed,
      role: overrides.role ?? 'USER',
    },
    select: { id: true, email: true, firstName: true, lastName: true },
  });

  return { ...created, plainPassword };
}

/**
 * Create a profile row linked to an existing user.
 */
export async function createTestProfile(
  prisma: PrismaService,
  userId: string,
  overrides: {
    name?: string;
    email?: string;
    linkedInUrl?: string | null;
    githubUrl?: string | null;
  } = {}
): Promise<SeededTestProfile> {
  const suffix = Date.now();

  return prisma.profile.create({
    data: {
      userId,
      name: overrides.name ?? 'Test Profile',
      email: overrides.email ?? `profile_${suffix}@example.com`,
      linkedInUrl: overrides.linkedInUrl ?? null,
      githubUrl: overrides.githubUrl ?? null,
    },
    select: { id: true, name: true, email: true, linkedInUrl: true, githubUrl: true, userId: true },
  }) as Promise<SeededTestProfile>;
}

// ─── Cleanup helpers ─────────────────────────────────────────────────────────

/** Delete profiles then users (cascade-safe order). */
export async function cleanUpUsers(prisma: PrismaService, userIds: string[]): Promise<void> {
  if (userIds.length === 0) return;
  await prisma.profile.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
}

/** Delete profiles only (leave the associated users). */
export async function cleanUpProfiles(prisma: PrismaService, userIds: string[]): Promise<void> {
  if (userIds.length === 0) return;
  await prisma.profile.deleteMany({ where: { userId: { in: userIds } } });
}

/** Delete password-reset rows by email. */
export async function cleanUpPasswordResets(
  prisma: PrismaService,
  emails: string[]
): Promise<void> {
  if (emails.length === 0) return;
  await prisma.passwordReset.deleteMany({ where: { email: { in: emails } } });
}
