import { PrismaService } from '@my-monorepo/database';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoggerService } from '@src/common/logger/logger.service';
import { GmailService } from '@src/services/gmail/gmail.service';
import { ValidPasswordRecord } from '@my-monorepo/types';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gmailService: GmailService,
    private readonly logger: LoggerService
  ) {}

  private buildResetPasswordUrl(token: string): string {
    this.logger.log('Building password reset URL', PasswordResetService.name);
    const configuredBaseUrl =
      process.env['PASSWORD_RESET_URL'] ??
      process.env['APP_WEB_URL'] ??
      process.env['CORS_ORIGIN']?.split(',')[0]?.trim() ??
      'http://localhost:4200';

    const baseUrl = configuredBaseUrl.endsWith('/')
      ? configuredBaseUrl.slice(0, -1)
      : configuredBaseUrl;
    const resetPath = '/reset-password';

    return `${baseUrl}${resetPath}?token=${encodeURIComponent(token)}`;
  }

  private getTokenHash(token: string): string {
    this.logger.log('Hashing password reset token', PasswordResetService.name);
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async getValidResetRecord(token: string): Promise<ValidPasswordRecord> {
    const tokenHash = this.getTokenHash(token);

    const record = await this.prisma.passwordReset.findFirst({
      where: {
        token: tokenHash,
      },
    });

    if (!record) {
      throw new BadRequestException('Invalid or expired reset link');
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset link');
    }

    return record;
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    this.logger.log('Processing password reset request', PasswordResetService.name);
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        message: 'If an account exists for this email, a reset link has been sent.',
      };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.getTokenHash(token);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.passwordReset.upsert({
      where: { email },
      update: {
        token: tokenHash,
        expiresAt,
      },
      create: {
        email,
        token: tokenHash,
        expiresAt,
      },
    });

    try {
      const resetUrl = this.buildResetPasswordUrl(token);
      await this.gmailService.sendPasswordResetLinkEmail(email, resetUrl);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset link to ${email}`,
        error instanceof Error ? error.stack : String(error),
        PasswordResetService.name
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to send password reset email');
    }

    return {
      message: 'If an account exists for this email, a reset link has been sent.',
    };
  }

  async validateResetToken(token: string): Promise<{ message: string }> {
    this.logger.log('Validating password reset token', PasswordResetService.name);
    await this.getValidResetRecord(token);

    return { message: 'Reset token is valid' };
  }

  async completePasswordReset(token: string, password: string): Promise<{ message: string }> {
    this.logger.log('Completing password reset', PasswordResetService.name);
    const record = await this.getValidResetRecord(token);

    const hashed = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: { email: record.email },
      data: { password: hashed },
    });

    await this.prisma.passwordReset.delete({
      where: { id: record.id },
    });

    return { message: 'Password updated' };
  }
}
