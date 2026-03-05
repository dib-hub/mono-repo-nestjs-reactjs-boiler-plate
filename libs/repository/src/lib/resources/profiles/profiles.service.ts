import { Injectable } from '@nestjs/common';
import { IProfile } from '@my-monorepo/types';

import { ProfileFindUniqueArgs, ProfileUpsertArgs } from '../../generated/client/models/Profile';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(query: ProfileFindUniqueArgs): Promise<IProfile> {
    return (await (this.prisma.profile.findUnique(query) as Promise<IProfile | null>)) as IProfile;
  }

  async upsertProfile(query: ProfileUpsertArgs): Promise<IProfile> {
    return (await (this.prisma.profile.upsert(query) as Promise<IProfile>)) as IProfile;
  }
}
