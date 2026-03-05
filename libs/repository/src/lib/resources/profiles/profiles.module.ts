import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../../database.module';
import { ProfilesService } from './profiles.repository';

@Module({
  imports: [DatabaseModule],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
