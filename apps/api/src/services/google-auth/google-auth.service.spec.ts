/**
 * GoogleAuthService — integration tests
 *
 * Uses real PrismaService against the Docker test database.
 * OAuth2Client (google-auth-library) and JwtService are mocked (external services).
 */
jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@my-monorepo/database';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { GoogleAuthService } from '@src/services/google-auth/google-auth.service';
import { cleanUpUsers, createTestUser } from '@src/testUtils';

describe('GoogleAuthService', () => {
  let module: TestingModule;
  let service: GoogleAuthService;
  let prisma: PrismaService;
  let mockVerifyIdToken: jest.Mock;
  let jwtService: { signAsync: jest.Mock };
  const userIdsToClean: string[] = [];

  beforeAll(async () => {
    process.env['GOOGLE_CLIENT_ID'] = 'test-client-id';

    mockVerifyIdToken = jest.fn();
    (OAuth2Client as unknown as jest.Mock).mockImplementation(() => ({
      verifyIdToken: mockVerifyIdToken,
    }));

    jwtService = { signAsync: jest.fn().mockResolvedValue('jwt-token') };

    module = await Test.createTestingModule({
      providers: [GoogleAuthService, PrismaService, { provide: JwtService, useValue: jwtService }],
    }).compile();

    service = module.get<GoogleAuthService>(GoogleAuthService);
    prisma = module.get<PrismaService>(PrismaService);
    await prisma.onModuleInit();
  });

  afterAll(async () => {
    await cleanUpUsers(prisma, userIdsToClean);
    await prisma.onModuleDestroy();
    await module.close();
    delete process.env['GOOGLE_CLIENT_ID'];
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jwtService.signAsync.mockResolvedValue('jwt-token');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should throw InternalServerErrorException when GOOGLE_CLIENT_ID is missing', () => {
      const originalId = process.env['GOOGLE_CLIENT_ID'];
      delete process.env['GOOGLE_CLIENT_ID'];

      expect(
        () =>
          new GoogleAuthService(
            prisma as unknown as PrismaService,
            jwtService as unknown as JwtService
          )
      ).toThrow(InternalServerErrorException);

      process.env['GOOGLE_CLIENT_ID'] = originalId;
    });
  });

  describe('verifyGoogleUser', () => {
    it('should return user info using given_name and family_name', async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({
          email: 'user@gmail.com',
          given_name: 'John',
          family_name: 'Doe',
          picture: 'https://photo.url',
          sub: 'google-123',
        }),
      });

      const result = await service.verifyGoogleUser('id-token');

      expect(result).toEqual({
        email: 'user@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        picture: 'https://photo.url',
        googleId: 'google-123',
      });
    });

    it('should fall back to name field when given_name/family_name are absent', async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({
          email: 'user@gmail.com',
          name: 'Jane Smith',
          sub: 'google-456',
        }),
      });

      const result = await service.verifyGoogleUser('id-token');

      expect(result.firstName).toBe('Jane');
      expect(result.lastName).toBe('Smith');
    });

    it('should use "User" as lastName when name has only one part', async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({
          email: 'user@gmail.com',
          name: 'SingleName',
          sub: 'google-789',
        }),
      });

      const result = await service.verifyGoogleUser('id-token');

      expect(result.firstName).toBe('SingleName');
      expect(result.lastName).toBe('User');
    });

    it('should throw UnauthorizedException when payload is null', async () => {
      mockVerifyIdToken.mockResolvedValue({ getPayload: () => null });

      await expect(service.verifyGoogleUser('bad-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when email is missing from payload', async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({ sub: 'abc', given_name: 'Test' }),
      });

      await expect(service.verifyGoogleUser('bad-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('loginWithGoogle', () => {
    const googlePayload = {
      email: 'google-login@gmail.com',
      given_name: 'John',
      family_name: 'Doe',
      picture: 'https://photo.url',
      sub: 'google-123',
    };

    beforeEach(() => {
      mockVerifyIdToken.mockResolvedValue({ getPayload: () => googlePayload });
    });

    it('should return existing user without creating a new one', async () => {
      const existingUser = await createTestUser(prisma, {
        email: googlePayload.email,
      });
      userIdsToClean.push(existingUser.id);

      const result = await service.loginWithGoogle('id-token');

      expect(result.user.email).toBe(googlePayload.email);
      expect(result.accessToken).toBe('jwt-token');
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: existingUser.id,
        email: existingUser.email,
      });
    });

    it('should create a new user when one does not exist', async () => {
      const uniquePayload = {
        ...googlePayload,
        email: `google-new-${Date.now()}@gmail.com`,
      };
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => uniquePayload,
      });

      const result = await service.loginWithGoogle('id-token');

      userIdsToClean.push((result.user as any).id);

      expect(result.user.email).toBe(uniquePayload.email);
      expect(result.accessToken).toBe('jwt-token');

      // Verify the user was persisted
      const dbUser = await prisma.user.findUnique({
        where: { email: uniquePayload.email },
      });
      expect(dbUser).not.toBeNull();
      expect(dbUser!.provider).toBe('GOOGLE');
    });
  });
});
