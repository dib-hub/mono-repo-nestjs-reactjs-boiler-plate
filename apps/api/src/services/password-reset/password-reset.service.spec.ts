jest.mock('@my-monorepo/database', () => ({
  PrismaService: class {},
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

import { PrismaService } from '@my-monorepo/database';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { GmailService } from '../gmail/gmail.service';
import { PasswordResetService } from './password-reset.service';

type PrismaMock = {
  user: {
    findUnique: jest.Mock;
    update: jest.Mock;
  };
  passwordReset: {
    upsert: jest.Mock;
    findUnique: jest.Mock;
    delete: jest.Mock;
  };
};

type GmailServiceMock = {
  sendOtpEmail: jest.Mock;
};

const mockedBcrypt = bcrypt as unknown as { hash: jest.Mock };

describe('PasswordResetService', () => {
  let service: PasswordResetService;
  let prisma: PrismaMock;
  let gmailService: GmailServiceMock;

  beforeEach(() => {
    jest.clearAllMocks();

    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      passwordReset: {
        upsert: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
    };

    gmailService = {
      sendOtpEmail: jest.fn(),
    };

    service = new PasswordResetService(
      prisma as unknown as PrismaService,
      gmailService as unknown as GmailService
    );
  });

  it('requestReset should throw when user does not exist', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.requestReset('missing@example.com')).rejects.toThrow(BadRequestException);

    expect(prisma.passwordReset.upsert).not.toHaveBeenCalled();
    expect(gmailService.sendOtpEmail).not.toHaveBeenCalled();
  });

  it('requestReset should store otp and send email when user exists', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'test@example.com',
    });
    prisma.passwordReset.upsert.mockResolvedValue({});
    gmailService.sendOtpEmail.mockResolvedValue(undefined);

    const result = await service.requestReset('test@example.com');

    expect(result).toEqual({ message: 'OTP sent to your email' });
    expect(prisma.passwordReset.upsert).toHaveBeenCalledTimes(1);
    expect(gmailService.sendOtpEmail).toHaveBeenCalledTimes(1);
    expect(gmailService.sendOtpEmail).toHaveBeenCalledWith(
      'test@example.com',
      expect.stringMatching(/^\d{6}$/)
    );
  });

  it('requestReset should throw InternalServerErrorException when email sending fails', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'test@example.com',
    });
    prisma.passwordReset.upsert.mockResolvedValue({});
    gmailService.sendOtpEmail.mockRejectedValue(new Error('gmail error'));

    await expect(service.requestReset('test@example.com')).rejects.toThrow(
      InternalServerErrorException
    );

    expect(prisma.passwordReset.upsert).toHaveBeenCalled();
  });

  it('verifyReset should throw for missing reset record', async () => {
    prisma.passwordReset.findUnique.mockResolvedValue(null);

    await expect(service.verifyReset('test@example.com', '123456', 'newPassword123')).rejects.toThrow(
      BadRequestException
    );

    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('verifyReset should throw for invalid otp', async () => {
    prisma.passwordReset.findUnique.mockResolvedValue({
      email: 'test@example.com',
      otp: '000000',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await expect(service.verifyReset('test@example.com', '123456', 'newPassword123')).rejects.toThrow(
      BadRequestException
    );

    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('verifyReset should throw for expired otp', async () => {
    prisma.passwordReset.findUnique.mockResolvedValue({
      email: 'test@example.com',
      otp: '123456',
      expiresAt: new Date(Date.now() - 1000),
    });

    await expect(service.verifyReset('test@example.com', '123456', 'newPassword123')).rejects.toThrow(
      BadRequestException
    );

    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('verifyReset should update password and delete otp record for valid otp', async () => {
    prisma.passwordReset.findUnique.mockResolvedValue({
      email: 'test@example.com',
      otp: '123456',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    mockedBcrypt.hash.mockResolvedValue('hashed-password');
    prisma.user.update.mockResolvedValue({});
    prisma.passwordReset.delete.mockResolvedValue({});

    const result = await service.verifyReset('test@example.com', '123456', 'newPassword123');

    expect(result).toEqual({ message: 'Password updated' });
    expect(mockedBcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
      data: { password: 'hashed-password' },
    });
    expect(prisma.passwordReset.delete).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });
});
