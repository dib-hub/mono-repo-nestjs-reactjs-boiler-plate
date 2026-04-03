import { PrismaService } from '@my-monorepo/database';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { GmailService } from '@src/services/gmail/gmail.service';

@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gmailService: GmailService
  ) {}

  async requestReset(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.passwordReset.upsert({
      where: { email },
      update: {
        otp,
        expiresAt,
      },
      create: {
        email,
        otp,
        expiresAt,
      },
    });

    try {
      await this.gmailService.sendOtpEmail(email, otp);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset OTP to ${email}`,
        error instanceof Error ? error.stack : String(error)
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to send OTP email');
    }

    return {
      message: 'OTP sent to your email',
    };
  }

  async verifyReset(email: string, otp: string, password: string): Promise<{ message: string }> {
    const record = await this.prisma.passwordReset.findUnique({
      where: { email },
    });

    if (!record) {
      throw new BadRequestException('Invalid request');
    }

    if (record.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    const hashed = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: { email },
      data: { password: hashed },
    });

    await this.prisma.passwordReset.delete({
      where: { email },
    });

    return { message: 'Password updated' };
  }
}
