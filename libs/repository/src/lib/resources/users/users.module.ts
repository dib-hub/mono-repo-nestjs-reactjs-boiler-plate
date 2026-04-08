import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../../database.module';
import { UsersService } from './users.repository';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
