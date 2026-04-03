/**
 * ProfilesController — integration tests
 *
 * Uses real PrismaService + ProfilesRepoService + ProfilesService against the
 * Docker test database. Controller methods are called directly to test both
 * routing/ownership logic AND real DB reads/writes.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { PrismaService, ProfilesService as ProfilesRepoService } from '@my-monorepo/database';

import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { UpsertProfileDto } from './dtos/profile.dto';
import { createTestUser, cleanUpUsers, SeededTestUser } from '../../testUtils';

describe('ProfilesController', () => {
  let module: TestingModule;
  let controller: ProfilesController;
  let service: ProfilesService;
  let prisma: PrismaService;
  let seededUser: SeededTestUser;
  const userIdsToClean: string[] = [];

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [ProfilesService, ProfilesRepoService, PrismaService],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
    service = module.get<ProfilesService>(ProfilesService);
    prisma = module.get<PrismaService>(PrismaService);
    await prisma.onModuleInit();

    seededUser = await createTestUser(prisma, {
      email: 'profiles-ctrl-test@example.com',
    });
    userIdsToClean.push(seededUser.id);
  });

  afterAll(async () => {
    await cleanUpUsers(prisma, userIdsToClean);
    await prisma.onModuleDestroy();
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ─── getProfileByUserId ─────────────────────────────────────────────────────

  describe('getProfileByUserId', () => {
    it('returns profile from DB when authenticated user matches route param', async () => {
      // Seed a profile so there is something to fetch
      await service.upsertProfile(seededUser.id, {
        name: 'Test Profile',
        email: 'profile@example.com',
      });

      const req = { user: { userId: seededUser.id, email: seededUser.email } };
      const result = await controller.getProfileByUserId(seededUser.id, req as any);

      expect(result).toBeDefined();
      expect(result.userId).toBe(seededUser.id);
      expect(result.name).toBe('Test Profile');
    });

    it('throws ForbiddenException when authenticated user differs from route param', async () => {
      const req = { user: { userId: 'other-user-id', email: 'other@example.com' } };

      await expect(controller.getProfileByUserId(seededUser.id, req as any)).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  // ─── upsertProfile ───────────────────────────────────────────────────────────

  describe('upsertProfile', () => {
    it('creates a new profile in DB for the authenticated user', async () => {
      const newUser = await createTestUser(prisma, {
        email: 'profiles-ctrl-create@example.com',
      });
      userIdsToClean.push(newUser.id);

      const dto: UpsertProfileDto = {
        name: 'New Controller Profile',
        email: 'ctrl-new@example.com',
        linkedInUrl: 'https://linkedin.com/in/ctrl',
        githubUrl: null,
      };
      const req = { user: { userId: newUser.id, email: newUser.email } };

      const result = await controller.upsertProfile(newUser.id, req as any, dto);

      expect(result.name).toBe('New Controller Profile');
      expect(result.userId).toBe(newUser.id);

      // Verify it was actually persisted
      const dbProfile = await prisma.profile.findUnique({ where: { userId: newUser.id } });
      expect(dbProfile).not.toBeNull();
      expect(dbProfile!.name).toBe('New Controller Profile');
    });

    it('updates an existing profile in DB', async () => {
      const dto: UpsertProfileDto = {
        name: 'Updated Controller Profile',
        email: 'ctrl-updated@example.com',
      };
      const req = { user: { userId: seededUser.id, email: seededUser.email } };

      const result = await controller.upsertProfile(seededUser.id, req as any, dto);

      expect(result.name).toBe('Updated Controller Profile');
      expect(result.email).toBe('ctrl-updated@example.com');
    });

    it("throws ForbiddenException when trying to update another user's profile", async () => {
      const dto: UpsertProfileDto = { name: 'Intruder', email: 'intruder@example.com' };
      const req = { user: { userId: 'intruder-id', email: 'intruder@example.com' } };

      await expect(controller.upsertProfile(seededUser.id, req as any, dto)).rejects.toThrow(
        ForbiddenException
      );
    });
  });
});
