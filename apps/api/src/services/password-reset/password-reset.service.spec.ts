/**
 * PasswordResetService — integration tests
 *
 * Uses real PrismaService against the Docker test database.
 * GmailService is mocked (external email service).
 */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@my-monorepo/database';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
  let gmailService: { sendOtpEmail: jest.Mock; sendEmail: jest.Mock };
  let seededUser: SeededTestUser;
  const userIdsToClean: string[] = [];
  const emailsToClean: string[] = [];

  beforeAll(async () => {
    gmailService = {
      sendOtpEmail: jest.fn(),
      sendEmail: jest.fn(),
    };

    module = await Test.createTestingModule({
      providers: [
        PasswordResetService,
        PrismaService,
        { provide: GmailService, useValue: gmailService },
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
    gmailService.sendOtpEmail.mockResolvedValue(undefined);
  });

  it('requestReset should throw when user does not exist', async () => {
    await expect(service.requestReset('missing@example.com')).rejects.toThrow(BadRequestException);
  });

  it('requestReset should store otp and send email when user exists', async () => {
    const result = await service.requestReset(seededUser.email);

    expect(result).toEqual({ message: 'OTP sent to your email' });
    expect(gmailService.sendOtpEmail).toHaveBeenCalledTimes(1);
    expect(gmailService.sendOtpEmail).toHaveBeenCalledWith(
      seededUser.email,
      expect.stringMatching(/^\d{6}$/)
    );

    // Verify the OTP record was persisted
    const record = await prisma.passwordReset.findUnique({
      where: { email: seededUser.email },
    });
    expect(record).not.toBeNull();
    expect(record!.otp).toMatch(/^\d{6}$/);
  });

  it('requestReset should throw InternalServerErrorException when email sending fails', async () => {
    gmailService.sendOtpEmail.mockRejectedValue(new Error('gmail error'));

    await expect(service.requestReset(seededUser.email)).rejects.toThrow(
      InternalServerErrorException
    );
  });

  it('verifyReset should throw for missing reset record', async () => {
    await expect(
      service.verifyReset('no-record@example.com', '123456', 'newPassword123')
    ).rejects.toThrow(BadRequestException);
  });

  it('verifyReset should throw for invalid otp', async () => {
    // Ensure a reset record exists
    await service.requestReset(seededUser.email);

    await expect(service.verifyReset(seededUser.email, '000000', 'newPassword123')).rejects.toThrow(
      BadRequestException
    );
  });

  it('verifyReset should throw for expired otp', async () => {
    // Insert an expired OTP directly
    await prisma.passwordReset.upsert({
      where: { email: seededUser.email },
      update: { otp: '999999', expiresAt: new Date(Date.now() - 1000) },
      create: {
        email: seededUser.email,
        otp: '999999',
        expiresAt: new Date(Date.now() - 1000),
      },
    });

    await expect(service.verifyReset(seededUser.email, '999999', 'newPassword123')).rejects.toThrow(
      BadRequestException
    );
  });

  it('verifyReset should update password and delete otp record for valid otp', async () => {
    const otp = '654321';
    await prisma.passwordReset.upsert({
      where: { email: seededUser.email },
      update: { otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
      create: {
        email: seededUser.email,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    const result = await service.verifyReset(seededUser.email, otp, 'newPassword123');

    expect(result).toEqual({ message: 'Password updated' });

    // Verify the password reset record was deleted
    const record = await prisma.passwordReset.findUnique({
      where: { email: seededUser.email },
    });
    expect(record).toBeNull();
  });
});
