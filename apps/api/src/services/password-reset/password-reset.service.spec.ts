import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@my-monorepo/database';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';
import { LoggerService } from '@src/common/logger/logger.service';
import { GmailService } from '@src/services/gmail/gmail.service';
import { PasswordResetService } from '@src/services/password-reset/password-reset.service';
import {
  cleanUpPasswordResets,
  cleanUpUsers,
  createTestUser,
  SeededTestUser,
} from '@src/testUtils';

describe('PasswordResetService', () => {
  let module: TestingModule;
  let service: PasswordResetService;
  let prisma: PrismaService;
  let gmailService: { sendPasswordResetLinkEmail: jest.Mock; sendEmail: jest.Mock };
  let seededUser: SeededTestUser;
  const userIdsToClean: string[] = [];
  const emailsToClean: string[] = [];

  beforeAll(async () => {
    gmailService = {
      sendPasswordResetLinkEmail: jest.fn(),
      sendEmail: jest.fn(),
    };

    module = await Test.createTestingModule({
      providers: [
        PasswordResetService,
        PrismaService,
        { provide: GmailService, useValue: gmailService },
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

    module.useLogger(false);

    service = module.get<PasswordResetService>(PasswordResetService);
    prisma = module.get<PrismaService>(PrismaService);
    await prisma.onModuleInit();

    seededUser = await createTestUser(prisma, {
      email: 'pw-reset-test@example.com',
    });
    userIdsToClean.push(seededUser.id);
    emailsToClean.push(seededUser.email);
  });

  afterAll(async () => {
    await cleanUpPasswordResets(prisma, emailsToClean);
    await cleanUpUsers(prisma, userIdsToClean);
    await prisma.onModuleDestroy();
    await module.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    gmailService.sendPasswordResetLinkEmail.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('requestPasswordReset should return a generic message when user does not exist', async () => {
    const result = await service.requestPasswordReset('missing@example.com');

    expect(result).toEqual({
      message: 'If an account exists for this email, a reset link has been sent.',
    });
    expect(gmailService.sendPasswordResetLinkEmail).not.toHaveBeenCalled();
  });

  it('requestPasswordReset should store token hash and send reset link when user exists', async () => {
    const result = await service.requestPasswordReset(seededUser.email);

    expect(result).toEqual({
      message: 'If an account exists for this email, a reset link has been sent.',
    });
    expect(gmailService.sendPasswordResetLinkEmail).toHaveBeenCalledTimes(1);
    expect(gmailService.sendPasswordResetLinkEmail).toHaveBeenCalledWith(
      seededUser.email,
      expect.stringContaining('/reset-password?token=')
    );

    const record = await prisma.passwordReset.findUnique({
      where: { email: seededUser.email },
    });
    expect(record).not.toBeNull();
    expect(record!.token).toHaveLength(64);
  });

  it('requestPasswordReset should throw InternalServerErrorException when email sending fails', async () => {
    gmailService.sendPasswordResetLinkEmail.mockRejectedValue(new Error('gmail error'));

    await expect(service.requestPasswordReset(seededUser.email)).rejects.toThrow(
      InternalServerErrorException
    );
  });

  it('validateResetToken should throw for missing reset record', async () => {
    await expect(service.validateResetToken('invalid-token')).rejects.toThrow(BadRequestException);
  });

  it('validateResetToken should throw for expired token', async () => {
    const token = 'expired-token';
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await prisma.passwordReset.upsert({
      where: { email: seededUser.email },
      update: { token: tokenHash, expiresAt: new Date(Date.now() - 1000) },
      create: {
        email: seededUser.email,
        token: tokenHash,
        expiresAt: new Date(Date.now() - 1000),
      },
    });

    await expect(service.validateResetToken(token)).rejects.toThrow(BadRequestException);
  });

  it('validateResetToken should return success for valid token', async () => {
    const token = 'valid-token-for-check';
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await prisma.passwordReset.upsert({
      where: { email: seededUser.email },
      update: { token: tokenHash, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
      create: {
        email: seededUser.email,
        token: tokenHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    await expect(service.validateResetToken(token)).resolves.toEqual({
      message: 'Reset token is valid',
    });
  });

  it('completePasswordReset should throw for missing reset record', async () => {
    await expect(service.completePasswordReset('invalid-token', 'newPassword123')).rejects.toThrow(
      BadRequestException
    );
  });

  it('completePasswordReset should throw for invalid token', async () => {
    await service.requestPasswordReset(seededUser.email);

    await expect(service.completePasswordReset('wrong-token', 'newPassword123')).rejects.toThrow(
      BadRequestException
    );
  });

  it('completePasswordReset should throw for expired token', async () => {
    const token = 'expired-token';
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await prisma.passwordReset.upsert({
      where: { email: seededUser.email },
      update: { token: tokenHash, expiresAt: new Date(Date.now() - 1000) },
      create: {
        email: seededUser.email,
        token: tokenHash,
        expiresAt: new Date(Date.now() - 1000),
      },
    });

    await expect(service.completePasswordReset(token, 'newPassword123')).rejects.toThrow(
      BadRequestException
    );
  });

  it('completePasswordReset should update password and delete token record for valid token', async () => {
    const token = 'valid-token';
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await prisma.passwordReset.upsert({
      where: { email: seededUser.email },
      update: { token: tokenHash, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
      create: {
        email: seededUser.email,
        token: tokenHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    const result = await service.completePasswordReset(token, 'newPassword123');

    expect(result).toEqual({ message: 'Password updated' });

    // Verify the password reset record was deleted
    const record = await prisma.passwordReset.findUnique({
      where: { email: seededUser.email },
    });
    expect(record).toBeNull();
  });
});
