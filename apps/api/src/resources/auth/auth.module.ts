import { Module } from '@nestjs/common';
import { PrismaService, UsersModule } from '@my-monorepo/database';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, type JwtSignOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@src/common/strategies/jwt-strategy';
import { LocalStrategy } from '@src/common/strategies/local.strategy';
import { AuthController } from '@src/resources/auth/auth.controller';
import { AuthService } from '@src/resources/auth/auth.service';
import { GmailService } from '@src/services/gmail/gmail.service';
import { GoogleAuthService } from '@src/services/google-auth/google-auth.service';
import { PasswordResetController } from '@src/services/password-reset/password-reset.controller';
import { PasswordResetService } from '@src/services/password-reset/password-reset.service';

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
