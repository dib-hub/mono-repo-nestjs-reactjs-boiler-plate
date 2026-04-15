import { Body, Controller, ForbiddenException, Get, Param, Put, Req } from '@nestjs/common';
import { REST_RESOURCE, REST_RESOURCE_ID, type JwtAuthRequest } from '@my-monorepo/types';
import { LoggerService } from '@src/common/logger/logger.service';
import { ProfilesService } from '@src/resources/profiles/profiles.service';
import { ProfileDto, UpsertProfileDto } from '@src/resources/profiles/dtos/profile.dto';

@Controller(REST_RESOURCE.PROFILES)
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly logger: LoggerService
  ) {}

  private assertOwnProfile(requestUserId: string, requestedUserId: string): void {
    this.logger.log('Validating profile ownership', ProfilesController.name);
    if (requestUserId !== requestedUserId) {
      this.logger.warn('Profile ownership validation failed', ProfilesController.name);
      throw new ForbiddenException('You can only access your own profile');
    }
  }

  @Get(REST_RESOURCE_ID.ID)
  async getProfileByUserId(
    @Param(REST_RESOURCE.ID) userId: string,
    @Req() req: JwtAuthRequest
  ): Promise<ProfileDto> {
    this.logger.log('Handling get profile request', ProfilesController.name);
    this.assertOwnProfile(req.user.userId, userId);

    return await this.profilesService.getProfileByUserId(userId);
  }

  @Put(REST_RESOURCE_ID.ID)
  async upsertProfile(
    @Param(REST_RESOURCE.ID) userId: string,
    @Req() { user }: JwtAuthRequest,
    @Body() dto: UpsertProfileDto
  ): Promise<ProfileDto> {
    this.logger.log('Handling upsert profile request', ProfilesController.name);
    this.assertOwnProfile(user.userId, userId);

    return await this.profilesService.upsertProfile(userId, dto);
  }
}
