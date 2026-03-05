import { Module } from '@nestjs/common';
import { ProfilesModule as ProfilesRepoModule } from '@my-monorepo/database';

import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [ProfilesRepoModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
