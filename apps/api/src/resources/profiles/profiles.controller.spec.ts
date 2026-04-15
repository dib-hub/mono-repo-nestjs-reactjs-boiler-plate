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
import { LoggerService } from '@src/common/logger/logger.service';
import { ProfilesController } from '@src/resources/profiles/profiles.controller';
import { ProfilesService } from '@src/resources/profiles/profiles.service';
import { UpsertProfileDto } from '@src/resources/profiles/dtos/profile.dto';
import { cleanUpUsers, createTestUser, SeededTestUser } from '@src/testUtils';

describe('ProfilesController', () => {
  let module: TestingModule;
  let controller: ProfilesController;
  let service: ProfilesService;
  let prisma: PrismaService;
  let seededUser: SeededTestUser;
  const userIdsToClean: string[] = [];
  const profileTestDto: UpsertProfileDto = {
    name: 'New Controller Profile',
    email: 'ctrl-new@example.com',
    linkedInUrl: 'https://linkedin.com/in/ctrl',
    githubUrl: 'https://github.com/ctrl',
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        ProfilesService,
        ProfilesRepoService,
        PrismaService,
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
    service = module.get<ProfilesService>(ProfilesService);
    prisma = module.get<PrismaService>(PrismaService);
    await prisma.onModuleInit();
  });

  afterAll(async () => {
    await cleanUpUsers(prisma, userIdsToClean);
    await prisma.onModuleDestroy();
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ─── upsertProfile ───────────────────────────────────────────────────────────

  describe('upsertProfile', () => {
    it('creates a new profile in DB for the authenticated user', async () => {
      const newUser = await createTestUser(prisma, {
        email: 'profiles-ctrl-create@example.com',
      });
      userIdsToClean.push(newUser.id);
      seededUser = newUser;
      if (!seededUser?.id) {
        throw new Error(
          'seededUser was not created — getProfileByUserId tests will fail without it'
        );
      }

      const req = { user: { userId: newUser.id, email: newUser.email } };
      const result = await controller.upsertProfile(newUser.id, req as any, profileTestDto);

      expect(result.name).toBe(profileTestDto.name);
      expect(result.userId).toBe(newUser.id);

      // Verify it was actually persisted
      const dbProfile = await prisma.profile.findUnique({ where: { userId: newUser.id } });
      expect(dbProfile).not.toBeNull();
      expect(dbProfile!.name).toBe(profileTestDto.name);
    });
  });

  // ─── getProfileByUserId ─────────────────────────────────────────────────────

  describe('getProfileByUserId', () => {
    it('upserts the profile using profileTestDto for the authenticated user', async () => {
      const req = { user: { userId: seededUser.id, email: seededUser.email } };
      const result = await controller.upsertProfile(seededUser.id, req as any, profileTestDto);

      expect(result.userId).toBe(seededUser.id);
      expect(result.name).toBe(profileTestDto.name);
    });

    it('returns the upserted profile from DB when authenticated user matches route param', async () => {
      const req = { user: { userId: seededUser.id, email: seededUser.email } };
      const result = await controller.getProfileByUserId(seededUser.id, req as any);

      expect(result).toBeDefined();
      expect(result.userId).toBe(seededUser.id);
      expect(result.name).toBe(profileTestDto.name);
      expect(result.email).toBe(profileTestDto.email);
      expect(result.linkedInUrl).toBe(profileTestDto.linkedInUrl);
      expect(result.githubUrl).toBe(profileTestDto.githubUrl);
    });

    it('throws ForbiddenException when authenticated user differs from route param', async () => {
      const req = { user: { userId: 'other-user-id', email: 'other@example.com' } };

      await expect(controller.getProfileByUserId(seededUser.id, req as any)).rejects.toThrow(
        ForbiddenException
      );
    });
  });
});
