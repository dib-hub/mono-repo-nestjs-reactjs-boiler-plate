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

import { LoggerService } from '@src/common/logger/logger.service';
import { GmailService } from '@src/services/gmail/gmail.service';

describe('GmailService', () => {
  let service: GmailService;
  let mockSend: jest.Mock;
  let loggerService: {
    log: jest.Mock;
    error: jest.Mock;
    warn: jest.Mock;
    debug: jest.Mock;
    verbose: jest.Mock;
  };

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
    loggerService = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    service = new GmailService(loggerService as unknown as LoggerService);
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
      expect(() => new GmailService(loggerService as unknown as LoggerService)).toThrow(
        InternalServerErrorException
      );
    });

    it('should throw InternalServerErrorException when GOOGLE_CLIENT_SECRET is missing', () => {
      delete process.env['GOOGLE_CLIENT_SECRET'];
      expect(() => new GmailService(loggerService as unknown as LoggerService)).toThrow(
        InternalServerErrorException
      );
    });

    it('should throw InternalServerErrorException when GOOGLE_REDIRECT_URI is missing', () => {
      delete process.env['GOOGLE_REDIRECT_URI'];
      expect(() => new GmailService(loggerService as unknown as LoggerService)).toThrow(
        InternalServerErrorException
      );
    });

    it('should throw InternalServerErrorException when GOOGLE_REFRESH_TOKEN is missing', () => {
      delete process.env['GOOGLE_REFRESH_TOKEN'];
      expect(() => new GmailService(loggerService as unknown as LoggerService)).toThrow(
        InternalServerErrorException
      );
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
});
