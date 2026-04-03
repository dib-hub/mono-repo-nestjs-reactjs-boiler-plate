/**
 * ProfilesService — integration tests
 *
 * Uses real PrismaService + ProfilesRepoService against the Docker test database.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService, ProfilesService as ProfilesRepoService } from '@my-monorepo/database';

import { ProfilesService } from './profiles.service';
import { UpsertProfileDto } from './dtos/profile.dto';
import { createTestUser, cleanUpUsers, SeededTestUser } from '../../testUtils';

describe('ProfilesService', () => {
  let module: TestingModule;
  let service: ProfilesService;
  let prisma: PrismaService;
  let seededUser: SeededTestUser;
  const userIdsToClean: string[] = [];

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [ProfilesService, ProfilesRepoService, PrismaService],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    prisma = module.get<PrismaService>(PrismaService);
    await prisma.onModuleInit();

    seededUser = await createTestUser(prisma, {
      email: 'profiles-svc-test@example.com',
    });
    userIdsToClean.push(seededUser.id);
  });

  afterAll(async () => {
    await cleanUpUsers(prisma, userIdsToClean);
    await prisma.onModuleDestroy();
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── getProfileByUserId ──────────────────────────────────────────────────

  describe('getProfileByUserId', () => {
    it('returns the profile for a valid userId', async () => {
      const dto: UpsertProfileDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        linkedInUrl: 'https://linkedin.com/in/janedoe',
        githubUrl: 'https://github.com/janedoe',
      };
      await service.upsertProfile(seededUser.id, dto);

      const result = await service.getProfileByUserId(seededUser.id);

      expect(result).toBeDefined();
      expect(result.userId).toBe(seededUser.id);
      expect(result.name).toBe('Jane Doe');
    });

    it('returns null when profile does not exist', async () => {
      const result = await service.getProfileByUserId('00000000-0000-0000-0000-000000000000');
      expect(result).toBeNull();
    });
  });

  // ─── upsertProfile ──────────────────────────────────────────────────────────

  describe('upsertProfile', () => {
    it('creates a new profile with all fields', async () => {
      const newUser = await createTestUser(prisma, {
        email: 'profiles-upsert-test@example.com',
      });
      userIdsToClean.push(newUser.id);

      const dto: UpsertProfileDto = {
        name: 'New Name',
        email: 'new@example.com',
        linkedInUrl: 'https://linkedin.com',
        githubUrl: null,
      };

      const result = await service.upsertProfile(newUser.id, dto);

      expect(result.name).toBe('New Name');
      expect(result.email).toBe('new@example.com');
      expect(result.userId).toBe(newUser.id);
    });

    it('sets optional fields to null when omitted from dto', async () => {
      const newUser = await createTestUser(prisma, {
        email: 'profiles-minimal-test@example.com',
      });
      userIdsToClean.push(newUser.id);

      const dto: UpsertProfileDto = { name: 'Minimal', email: 'min@example.com' };

      const result = await service.upsertProfile(newUser.id, dto);

      expect(result.linkedInUrl).toBeNull();
      expect(result.githubUrl).toBeNull();
    });

    it('updates an existing profile name and email', async () => {
      const newUser = await createTestUser(prisma, {
        email: 'profiles-update-test@example.com',
      });
      userIdsToClean.push(newUser.id);

      await service.upsertProfile(newUser.id, {
        name: 'Original',
        email: 'original@example.com',
      });

      const dto: UpsertProfileDto = {
        name: 'Updated Name',
        email: 'updated@example.com',
        linkedInUrl: null,
        githubUrl: null,
      };

      const result = await service.upsertProfile(newUser.id, dto);

      expect(result.name).toBe('Updated Name');
      expect(result.email).toBe('updated@example.com');
    });
  });
});
