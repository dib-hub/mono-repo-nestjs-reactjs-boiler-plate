/**
 * ProfilesService (repository layer) — integration tests
 *
 * Uses a real PrismaService against the Docker test database.
 */
import { IProfile } from '@my-monorepo/types';
import { PrismaService } from '../../prisma.service';
import { ProfilesService } from './profiles.repository';

describe('ProfilesService (integration)', () => {
  let service: ProfilesService;
  let prisma: PrismaService;
  let seededUserId: string;
  let seededProfile: IProfile;
  const userIdsToClean: string[] = [];

  const profileTestData = {
    name: 'Repo Test Profile',
    email: 'repo-profile@example.com',
    linkedInUrl: 'https://linkedin.com/in/repotest',
    githubUrl: 'https://github.com/repotest',
  };

  async function seedUser(emailSuffix: string): Promise<string> {
    const user = await prisma.user.create({
      data: {
        email: `profiles-repo-${emailSuffix}@example.com`,
        firstName: 'ProfileTest',
        lastName: 'User',
        password: 'hash-placeholder',
        role: 'USER',
      },
      select: { id: true },
    });
    userIdsToClean.push(user.id);
    return user.id;
  }

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.onModuleInit();
    service = new ProfilesService(prisma);
  });

  afterAll(async () => {
    if (userIdsToClean.length > 0) {
      await prisma.profile.deleteMany({ where: { userId: { in: userIdsToClean } } });
      await prisma.user.deleteMany({ where: { id: { in: userIdsToClean } } });
    }
    await prisma.onModuleDestroy();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── upsertProfile ───────────────────────────────────────────────────────────

  describe('upsertProfile', () => {
    it('creates a new profile with all fields for the test user', async () => {
      seededUserId = await seedUser('upsert-main');
      if (!seededUserId) {
        throw new Error('seededUserId was not created — getProfile tests will fail without it');
      }

      const result = await service.upsertProfile({
        where: { userId: seededUserId },
        create: {
          user: { connect: { id: seededUserId } },
          name: profileTestData.name,
          email: profileTestData.email,
          linkedInUrl: profileTestData.linkedInUrl,
          githubUrl: profileTestData.githubUrl,
        },
        update: {
          name: profileTestData.name,
          email: profileTestData.email,
          linkedInUrl: profileTestData.linkedInUrl,
          githubUrl: profileTestData.githubUrl,
        },
      });

      seededProfile = result;

      expect(result.userId).toBe(seededUserId);
      expect(result.name).toBe(profileTestData.name);
      expect(result.email).toBe(profileTestData.email);
      expect(result.linkedInUrl).toBe(profileTestData.linkedInUrl);
      expect(result.githubUrl).toBe(profileTestData.githubUrl);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('sets optional fields to null when omitted', async () => {
      const userId = await seedUser('upsert-minimal');

      const result = await service.upsertProfile({
        where: { userId },
        create: {
          user: { connect: { id: userId } },
          name: 'Minimal Profile',
          email: 'minimal@example.com',
        },
        update: {
          name: 'Minimal Profile',
          email: 'minimal@example.com',
        },
      });

      expect(result.linkedInUrl).toBeNull();
      expect(result.githubUrl).toBeNull();
    });

    it('updates an existing profile on second upsert', async () => {
      const userId = await seedUser('upsert-update');

      await service.upsertProfile({
        where: { userId },
        create: {
          user: { connect: { id: userId } },
          name: 'Original Name',
          email: 'original@example.com',
        },
        update: { name: 'Original Name', email: 'original@example.com' },
      });

      const updated = await service.upsertProfile({
        where: { userId },
        create: {
          user: { connect: { id: userId } },
          name: 'Updated Name',
          email: 'updated@example.com',
          linkedInUrl: 'https://linkedin.com/in/updated',
          githubUrl: null,
        },
        update: {
          name: 'Updated Name',
          email: 'updated@example.com',
          linkedInUrl: 'https://linkedin.com/in/updated',
          githubUrl: null,
        },
      });

      expect(updated.name).toBe('Updated Name');
      expect(updated.email).toBe('updated@example.com');
      expect(updated.linkedInUrl).toBe('https://linkedin.com/in/updated');
      expect(updated.githubUrl).toBeNull();
      expect(updated.userId).toBe(userId);
    });
  });

  // ─── getProfile ──────────────────────────────────────────────────────────────

  describe('getProfile', () => {
    it('returns the upserted profile for the seeded user by userId', async () => {
      const result = await service.getProfile({ where: { userId: seededUserId } });

      expect(result).not.toBeNull();
      expect(result.userId).toBe(seededUserId);
      expect(result.name).toBe(profileTestData.name);
      expect(result.email).toBe(profileTestData.email);
      expect(result.linkedInUrl).toBe(profileTestData.linkedInUrl);
      expect(result.githubUrl).toBe(profileTestData.githubUrl);
    });

    it('returns the upserted profile for the seeded user by profile id', async () => {
      const result = await service.getProfile({ where: { id: seededProfile.id } });

      expect(result).not.toBeNull();
      expect(result.id).toBe(seededProfile.id);
      expect(result.name).toBe(profileTestData.name);
    });

    it('returns null for a non-existent userId', async () => {
      const result = await service.getProfile({
        where: { userId: '00000000-0000-0000-0000-000000000000' },
      });

      expect(result).toBeNull();
    });
  });
});
