import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '@my-monorepo/database';
import { IUser } from '@my-monorepo/types';
import { LoggerService } from '@src/common/logger/logger.service';

@Injectable()
export class GoogleAuthService {
  private readonly client: OAuth2Client;
  private readonly googleClientId: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService
  ) {
    const googleClientId = process.env['GOOGLE_CLIENT_ID'];

    if (!googleClientId) {
      throw new InternalServerErrorException('GOOGLE_CLIENT_ID is not configured');
    }

    this.googleClientId = googleClientId;
    this.client = new OAuth2Client(this.googleClientId);
  }

  async verifyGoogleUser(idToken: string): Promise<{
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
    googleId: string;
  }> {
    this.logger.log('Verifying Google identity token', GoogleAuthService.name);
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new UnauthorizedException('Invalid Google token');
    }
    const fallbackName = payload.name?.trim();
    const [firstNameFromName, ...lastNameParts] = fallbackName ? fallbackName.split(/\s+/) : [];
    const fallbackLastName = lastNameParts.join(' ') || 'User';

    return {
      email: payload.email,
      firstName: payload.given_name ?? firstNameFromName,
      lastName: payload.family_name ?? fallbackLastName,
      picture: payload.picture,
      googleId: payload.sub,
    };
  }

  async loginWithGoogle(idToken: string): Promise<{
    user: IUser;
    accessToken: string;
  }> {
    this.logger.log('Authenticating user with Google', GoogleAuthService.name);
    const googleUser = await this.verifyGoogleUser(idToken);

    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      this.logger.log('Creating a new Google-backed user account', GoogleAuthService.name);
      const oauthPasswordHash = await bcrypt.hash(randomUUID(), 10);

      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          password: oauthPasswordHash,
          googleId: googleUser.googleId,
          avatar: googleUser.picture,
          provider: 'GOOGLE',
        },
      });
    }

    const jwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload);

    return {
      user: user as IUser,
      accessToken,
    };
  }
}
