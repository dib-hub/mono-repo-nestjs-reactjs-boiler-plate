import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@my-monorepo/database';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';
import { AuthModule } from '@src/resources/auth/auth.module';
import { ProfilesModule } from '@src/resources/profiles/profiles.module';
import { AppController } from '@src/app/app.controller';
import { AppService } from '@src/app/app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
    }),
    UsersModule,
    AuthModule,
    ProfilesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
