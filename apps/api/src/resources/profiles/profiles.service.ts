import { Injectable } from '@nestjs/common';
import { ProfilesService as ProfilesRepoService } from '@my-monorepo/database';
import { LoggerService } from '@src/common/logger/logger.service';
import { ProfileDto, UpsertProfileDto } from '@src/resources/profiles/dtos/profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly profilesRepoService: ProfilesRepoService,
    private readonly logger: LoggerService
  ) {}

  async getProfileByUserId(userId: string): Promise<ProfileDto> {
    this.logger.log('Fetching profile by user id', ProfilesService.name);
    return (await this.profilesRepoService.getProfile({
      where: { userId },
      select: {
        id: true,
        name: true,
        email: true,
        linkedInUrl: true,
        githubUrl: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as ProfileDto;
  }

  async upsertProfile(userId: string, dto: UpsertProfileDto): Promise<ProfileDto> {
    this.logger.log('Upserting profile data', ProfilesService.name);
    return (await this.profilesRepoService.upsertProfile({
      where: { userId },
      create: {
        name: dto.name,
        email: dto.email,
        linkedInUrl: dto.linkedInUrl ?? null,
        githubUrl: dto.githubUrl ?? null,
        userId,
      },
      update: {
        name: dto.name,
        email: dto.email,
        linkedInUrl: dto.linkedInUrl ?? null,
        githubUrl: dto.githubUrl ?? null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        linkedInUrl: true,
        githubUrl: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    })) as ProfileDto;
  }
}
