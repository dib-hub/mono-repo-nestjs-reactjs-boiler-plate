jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn(),
    },
    gmail: jest.fn(),
  },
}));

import { InternalServerErrorException } from '@nestjs/common';
import { google } from 'googleapis';

import { GmailService } from './gmail.service';

describe('GmailService', () => {
  let service: GmailService;
  let mockSend: jest.Mock;

  const validEnv = {
    GOOGLE_CLIENT_ID: 'client-id',
    GOOGLE_CLIENT_SECRET: 'client-secret',
    GOOGLE_REDIRECT_URI: 'http://redirect',
    GOOGLE_REFRESH_TOKEN: 'refresh-token',
    MAIL_SENDER_EMAIL: 'sender@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(process.env, validEnv);

    mockSend = jest.fn();
    (google.auth.OAuth2 as unknown as jest.Mock).mockImplementation(() => ({
      setCredentials: jest.fn(),
    }));
    (google.gmail as unknown as jest.Mock).mockReturnValue({
      users: { messages: { send: mockSend } },
    });

    service = new GmailService();
  });

  afterEach(() => {
    Object.keys(validEnv).forEach((key) => delete process.env[key]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should throw InternalServerErrorException when GOOGLE_CLIENT_ID is missing', () => {
      delete process.env['GOOGLE_CLIENT_ID'];
      expect(() => new GmailService()).toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException when GOOGLE_CLIENT_SECRET is missing', () => {
      delete process.env['GOOGLE_CLIENT_SECRET'];
      expect(() => new GmailService()).toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException when GOOGLE_REDIRECT_URI is missing', () => {
      delete process.env['GOOGLE_REDIRECT_URI'];
      expect(() => new GmailService()).toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException when GOOGLE_REFRESH_TOKEN is missing', () => {
      delete process.env['GOOGLE_REFRESH_TOKEN'];
      expect(() => new GmailService()).toThrow(InternalServerErrorException);
    });
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      mockSend.mockResolvedValue({});

      await expect(
        service.sendEmail('to@example.com', 'Subject', '<p>Hello</p>')
      ).resolves.toBeUndefined();

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'me',
          requestBody: { raw: expect.any(String) },
        })
      );
    });

    it('should throw InternalServerErrorException with scope hint on 403 insufficient scope', async () => {
      mockSend.mockRejectedValue({
        code: 403,
        response: {
          data: { error: { message: 'Request had insufficient authentication scopes.' } },
        },
      });

      await expect(service.sendEmail('to@example.com', 'Subject', '<p>Hello</p>')).rejects.toThrow(
        InternalServerErrorException
      );
    });

    it('should throw InternalServerErrorException using response error message for non-scope errors', async () => {
      mockSend.mockRejectedValue({
        code: 500,
        response: { data: { error: { message: 'Internal Google error' } } },
      });

      await expect(service.sendEmail('to@example.com', 'Subject', '<p>Hello</p>')).rejects.toThrow(
        InternalServerErrorException
      );
    });

    it('should throw InternalServerErrorException falling back to err.message', async () => {
      mockSend.mockRejectedValue({ message: 'Network failure' });

      await expect(service.sendEmail('to@example.com', 'Subject', '<p>Hello</p>')).rejects.toThrow(
        InternalServerErrorException
      );
    });

    it('should throw InternalServerErrorException with unknown error when no message available', async () => {
      mockSend.mockRejectedValue({});

      await expect(service.sendEmail('to@example.com', 'Subject', '<p>Hello</p>')).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('sendOtpEmail', () => {
    it('should call sendEmail with password reset subject and OTP in body', async () => {
      mockSend.mockResolvedValue({});

      await service.sendOtpEmail('to@example.com', '123456');

      expect(mockSend).toHaveBeenCalledTimes(1);
      const call = mockSend.mock.calls[0][0] as { requestBody: { raw: string } };
      // Restore URL-safe base64 to standard before decoding
      const standardBase64 = call.requestBody.raw.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = Buffer.from(standardBase64, 'base64').toString('utf-8');
      expect(decoded).toContain('123456');
    });
  });
});
