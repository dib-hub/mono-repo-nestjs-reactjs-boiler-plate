jest.mock('@my-monorepo/database', () => ({
  PrismaService: class {},
}));

jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@my-monorepo/database';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { GoogleAuthService } from './google-auth.service';

type PrismaMock = {
  user: {
    findUnique: jest.Mock;
    create: jest.Mock;
  };
};

type JwtServiceMock = {
  signAsync: jest.Mock;
};

const mockedBcrypt = bcrypt as unknown as { hash: jest.Mock };

describe('GoogleAuthService', () => {
  let service: GoogleAuthService;
  let prisma: PrismaMock;
  let jwtService: JwtServiceMock;
  let mockVerifyIdToken: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env['GOOGLE_CLIENT_ID'] = 'test-client-id';

    mockVerifyIdToken = jest.fn();
    (OAuth2Client as unknown as jest.Mock).mockImplementation(() => ({
      verifyIdToken: mockVerifyIdToken,
    }));

    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    service = new GoogleAuthService(
      prisma as unknown as PrismaService,
      jwtService as unknown as JwtService
    );
  });

  afterEach(() => {
    delete process.env['GOOGLE_CLIENT_ID'];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should throw InternalServerErrorException when GOOGLE_CLIENT_ID is missing', () => {
      delete process.env['GOOGLE_CLIENT_ID'];
      expect(
        () =>
          new GoogleAuthService(
            prisma as unknown as PrismaService,
            jwtService as unknown as JwtService
          )
      ).toThrow(InternalServerErrorException);
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
      email: 'user@gmail.com',
      given_name: 'John',
      family_name: 'Doe',
      picture: 'https://photo.url',
      sub: 'google-123',
    };

    beforeEach(() => {
      mockVerifyIdToken.mockResolvedValue({ getPayload: () => googlePayload });
    });

    it('should return existing user without creating a new one', async () => {
      const existingUser = { id: 'u1', email: 'user@gmail.com' };
      prisma.user.findUnique.mockResolvedValue(existingUser);
      jwtService.signAsync.mockResolvedValue('jwt-token');

      const result = await service.loginWithGoogle('id-token');

      expect(result.user).toBe(existingUser);
      expect(result.accessToken).toBe('jwt-token');
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: existingUser.id,
        email: existingUser.email,
      });
    });

    it('should create a new user when one does not exist', async () => {
      const newUser = { id: 'u2', email: 'user@gmail.com' };
      prisma.user.findUnique.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashed-uuid');
      prisma.user.create.mockResolvedValue(newUser);
      jwtService.signAsync.mockResolvedValue('jwt-token');

      const result = await service.loginWithGoogle('id-token');

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: googlePayload.email,
          firstName: googlePayload.given_name,
          lastName: googlePayload.family_name,
          googleId: googlePayload.sub,
          avatar: googlePayload.picture,
          provider: 'GOOGLE',
          password: 'hashed-uuid',
        }),
      });
      expect(result.user).toBe(newUser);
      expect(result.accessToken).toBe('jwt-token');
    });
  });
});
