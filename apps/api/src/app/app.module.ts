import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@my-monorepo/database';
import { APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from '@src/common/filters/all-exceptions-filter';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { AuthModule } from '@src/resources/auth/auth.module';
import { ProfilesModule } from '@src/resources/profiles/profiles.module';
import { AppController } from '@src/app/app.controller';
import { AppService } from '@src/app/app.service';
import { LoggerModule } from '@src/common/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
    }),
    UsersModule,
    AuthModule,
    ProfilesModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AllExceptionsFilter,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
