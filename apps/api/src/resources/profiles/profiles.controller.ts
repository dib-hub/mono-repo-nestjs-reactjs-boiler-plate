import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { REST_RESOURCE, REST_RESOURCE_ID } from '@my-monorepo/types';

import { ProfilesService } from './profiles.service';
import { ProfileDto, UpsertProfileDto } from './dtos/profile.dto';

@Controller(REST_RESOURCE.PROFILES)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(REST_RESOURCE_ID.ID)
  async getProfileByUserId(@Param(REST_RESOURCE.ID) userId: string): Promise<ProfileDto> {
    return this.profilesService.getProfileByUserId(userId);
  }

  @Put(REST_RESOURCE_ID.ID)
  async upsertProfile(
    @Param(REST_RESOURCE_ID.ID) userId: string,
    @Body() dto: UpsertProfileDto
  ): Promise<ProfileDto> {
    return this.profilesService.upsertProfile(userId, dto);
  }
}
