/**
 * AuthService — integration tests
 *
 * Uses real PrismaService + UsersService against the Docker test database.
 * Only JwtService is mocked (no real signing needed).
 */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService, UsersService } from '@my-monorepo/database';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/user.dto';
import { createTestUser, cleanUpUsers, SeededTestUser } from '../../testUtils';

describe('AuthService', () => {
  let module: TestingModule;
  let service: AuthService;
  let prisma: PrismaService;
  let seededUser: SeededTestUser;
  const userIdsToClean: string[] = [];

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        PrismaService,
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mock-jwt-token') },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    await prisma.onModuleInit();

    seededUser = await createTestUser(prisma, {
      email: 'auth-svc-test@example.com',
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

  // ─── validateUser ──────────────────────────────────────────────────────────

  describe('validateUser', () => {
    it('returns sanitized user when credentials are correct', async () => {
      const result = await service.validateUser(seededUser.email, seededUser.plainPassword);

      expect(result).not.toBeNull();
      expect(result!.email).toBe(seededUser.email);
      expect(result).not.toHaveProperty('password');
    });

    it('returns null when password is wrong', async () => {
      const result = await service.validateUser(seededUser.email, 'wrong-pass');
      expect(result).toBeNull();
    });

    it('returns null when user does not exist', async () => {
      const result = await service.validateUser('nobody@example.com', 'pass');
      expect(result).toBeNull();
    });
  });

  // ─── signup ────────────────────────────────────────────────────────────────

  describe('signup', () => {
    const dto: CreateUserDto = {
      email: 'auth-svc-signup@example.com',
      firstName: 'New',
      lastName: 'User',
      password: 'Password123!',
    };

    it('hashes password, creates user, and returns a JWT', async () => {
      const result = await service.signup(dto);
      userIdsToClean.push(result.user.id!);

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user.email).toBe(dto.email);
      expect(result.user).not.toHaveProperty('password');
    });

    it('throws BadRequestException when email is already in use', async () => {
      await expect(service.signup(dto)).rejects.toThrow(BadRequestException);
    });
  });

  // ─── signIn ────────────────────────────────────────────────────────────────

  describe('signIn', () => {
    it('builds auth response from a pre-validated user object', async () => {
      const userDto = {
        id: seededUser.id,
        email: seededUser.email,
        firstName: seededUser.firstName,
        lastName: seededUser.lastName,
        role: 'USER' as const,
      };

      const result = await service.signIn(userDto as any);

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user.id).toBe(seededUser.id);
    });
  });

  // ─── signInWithCredentials ─────────────────────────────────────────────────

  describe('signInWithCredentials', () => {
    it('returns auth response for valid credentials', async () => {
      const result = await service.signInWithCredentials(
        seededUser.email,
        seededUser.plainPassword
      );

      expect(result.accessToken).toBeDefined();
      expect(result.user.email).toBe(seededUser.email);
    });

    it('throws UnauthorizedException when password is wrong', async () => {
      await expect(service.signInWithCredentials(seededUser.email, 'bad-pass')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('throws UnauthorizedException when user does not exist', async () => {
      await expect(service.signInWithCredentials('ghost@example.com', 'pass')).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  // ─── getUserById ───────────────────────────────────────────────────────────

  describe('getUserById', () => {
    it('returns user without password field', async () => {
      const result = await service.getUserById(seededUser.id);

      expect(result.id).toBe(seededUser.id);
      expect(result.email).toBe(seededUser.email);
      expect(result).not.toHaveProperty('password');
    });

    it('throws BadRequestException when user is not found', async () => {
      await expect(service.getUserById('00000000-0000-0000-0000-000000000000')).rejects.toThrow(
        BadRequestException
      );
    });
  });
});
