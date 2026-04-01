import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GmailService {
  private static readonly REQUIRED_SCOPE = 'https://www.googleapis.com/auth/gmail.send';

  private readonly logger = new Logger(GmailService.name);
  private gmail;

  constructor() {
    const googleClientId = process.env['GOOGLE_CLIENT_ID'];
    const googleClientSecret = process.env['GOOGLE_CLIENT_SECRET'];
    const googleRedirectUri = process.env['GOOGLE_REDIRECT_URI'];
    const googleRefreshToken = process.env['GOOGLE_REFRESH_TOKEN'];

    if (!googleClientId || !googleClientSecret || !googleRedirectUri || !googleRefreshToken) {
      throw new InternalServerErrorException(
        'Gmail OAuth env vars are missing. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, and GOOGLE_REFRESH_TOKEN.'
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      googleClientId,
      googleClientSecret,
      googleRedirectUri
    );

    oauth2Client.setCredentials({
      refresh_token: googleRefreshToken,
    });

    this.gmail = google.gmail({
      version: 'v1',
      auth: oauth2Client,
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const sender = process.env['MAIL_SENDER_EMAIL'];

    const messageParts = [
      `From: ${sender}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      html,
    ];

    const message = messageParts.join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    try {
      await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      const err = error as {
        code?: number;
        message?: string;
        response?: { data?: { error?: { message?: string } } };
      };

      const message = err.response?.data?.error?.message ?? err.message ?? 'Unknown Gmail error';

      this.logger.error(`Failed to send email: ${message}`);

      if (
        err.code === 403 &&
        message.toLowerCase().includes('insufficient authentication scopes')
      ) {
        throw new InternalServerErrorException(
          `Gmail OAuth token is missing the required scope (${GmailService.REQUIRED_SCOPE}). Re-generate GOOGLE_REFRESH_TOKEN with this scope.`
        );
      }

      throw new InternalServerErrorException('Failed to send email via Gmail API');
    }
  }

  async sendOtpEmail(to: string, otp: string): Promise<void> {
    const subject = 'Password Reset OTP';

    const html = `
      <h3>Password Reset</h3>
      <p>Your OTP code is:</p>
      <h2>${otp}</h2>
      <p>This code will expire in 10 minutes.</p>
    `;

    await this.sendEmail(to, subject, html);
  }
}
