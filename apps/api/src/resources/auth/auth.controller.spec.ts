/**
 * AuthController — integration tests
 *
 * Uses real PrismaService + UsersService + AuthService against the Docker test
 * database. JwtService is mocked (no real signing). GoogleAuthService is mocked
 * (external OAuth, no network calls in tests).
 */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService, UsersService } from '@my-monorepo/database';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleAuthService } from '../../services/google-auth/google-auth.service';
import { CreateUserDto } from './dto/user.dto';
import { createTestUser, cleanUpUsers, SeededTestUser } from '../../testUtils';

describe('AuthController', () => {
  let module: TestingModule;
  let controller: AuthController;
  let prisma: PrismaService;
  let seededUser: SeededTestUser;
  let googleAuthService: { loginWithGoogle: jest.Mock };
  const userIdsToClean: string[] = [];

  beforeAll(async () => {
    googleAuthService = { loginWithGoogle: jest.fn() };

    module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        PrismaService,
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('mock-jwt-token') } },
        { provide: GoogleAuthService, useValue: googleAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    prisma = module.get<PrismaService>(PrismaService);
    await prisma.onModuleInit();

    seededUser = await createTestUser(prisma, {
      email: 'auth-ctrl-test@example.com',
    });
    userIdsToClean.push(seededUser.id);
  });

  afterAll(async () => {
    await cleanUpUsers(prisma, userIdsToClean);
    await prisma.onModuleDestroy();
    await module.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    module.get<JwtService>(JwtService).sign = jest.fn().mockReturnValue('mock-jwt-token');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ─── signUp ────────────────────────────────────────────────────────────────

  describe('signUp', () => {
    const dto: CreateUserDto = {
      email: 'auth-ctrl-signup@example.com',
      firstName: 'New',
      lastName: 'User',
      password: 'Password123!',
    };

    it('creates a user in DB and returns an auth response', async () => {
      const result = await controller.signUp(dto);
      userIdsToClean.push(result.user.id!);

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user.email).toBe(dto.email);
      expect(result.user).not.toHaveProperty('password');

      // Verify the user was actually persisted
      const dbUser = await prisma.user.findUnique({ where: { email: dto.email } });
      expect(dbUser).not.toBeNull();
    });

    it('throws BadRequestException when email is already in use', async () => {
      await expect(controller.signUp(dto)).rejects.toThrow(BadRequestException);
    });
  });

  // ─── signIn ────────────────────────────────────────────────────────────────

  describe('signIn', () => {
    it('returns auth response from a pre-validated user object (simulates LocalStrategy output)', async () => {
      const req = {
        user: {
          id: seededUser.id,
          email: seededUser.email,
          firstName: seededUser.firstName,
          lastName: seededUser.lastName,
          role: 'USER' as const,
        },
      };

      const result = await controller.signIn(req as any);

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user.id).toBe(seededUser.id);
      expect(result.user.email).toBe(seededUser.email);
    });
  });

  // ─── me ───────────────────────────────────────────────────────────────────

  describe('me', () => {
    it('returns the real user from DB identified by JWT payload userId', async () => {
      const req = { user: { userId: seededUser.id, email: seededUser.email } };

      const result = await controller.me(req as any);

      expect(result.id).toBe(seededUser.id);
      expect(result.email).toBe(seededUser.email);
      expect(result).not.toHaveProperty('password');
    });
  });

  // ─── getUserById ───────────────────────────────────────────────────────────

  describe('getUserById', () => {
    it('returns the real user from DB when requesting user matches the target id', async () => {
      const req = { user: { userId: seededUser.id, email: seededUser.email } };

      const result = await controller.getUserById(seededUser.id, req as any);

      expect(result.id).toBe(seededUser.id);
      expect(result.email).toBe(seededUser.email);
      expect(result).not.toHaveProperty('password');
    });

    it('throws ForbiddenException when requesting a different user ID', async () => {
      const req = { user: { userId: 'different-id', email: 'other@example.com' } };

      await expect(controller.getUserById(seededUser.id, req as any)).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  // ─── googleLogin ──────────────────────────────────────────────────────────

  describe('googleLogin', () => {
    it('delegates to GoogleAuthService (mocked — external OAuth) and returns its response', async () => {
      const mockResponse = {
        user: { id: seededUser.id, email: seededUser.email } as any,
        accessToken: 'google-jwt',
      };
      googleAuthService.loginWithGoogle.mockResolvedValue(mockResponse);

      const result = await controller.googleLogin({ idToken: 'fake-google-token' });

      expect(result).toEqual(mockResponse);
      expect(googleAuthService.loginWithGoogle).toHaveBeenCalledWith('fake-google-token');
    });
  });
});
