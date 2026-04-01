import { Module } from '@nestjs/common';
import { PrismaService, UsersModule } from '@my-monorepo/database';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, type JwtSignOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../../common/strategies/jwt-strategy';
import { LocalStrategy } from '../../common/strategies/local.strategy';
import { GoogleAuthService } from '../../services/google-auth/google-auth.service';
import { GmailService } from '../../services/gmail/gmail.service';
import { PasswordResetController } from '../../services/password-reset/password-reset.controller';
import { PasswordResetService } from '../../services/password-reset/password-reset.service';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const expiresIn = (configService.get<string>('JWT_EXPIRES_IN') ??
          '7d') as JwtSignOptions['expiresIn'];

        return {
          secret: configService.getOrThrow<string>('JWT_SECRET'),
          signOptions: { expiresIn },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, PasswordResetController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    GoogleAuthService,
    PrismaService,
    GmailService,
    PasswordResetService,
  ],
  exports: [JwtModule, GoogleAuthService, PrismaService, GmailService],
})
export class AuthModule {}
