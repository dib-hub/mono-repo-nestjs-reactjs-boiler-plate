jest.mock('@my-monorepo/database', () => ({
  ProfilesService: class {},
}));

import { NotFoundException } from '@nestjs/common';
import { IProfile } from '@my-monorepo/types';
import { ProfilesService as ProfilesRepoService } from '@my-monorepo/database';

import { ProfilesService } from './profiles.service';
import { UpsertProfileDto } from './dtos/profile.dto';

// Mock matches the actual ProfilesRepoService methods called by ProfilesService
type ProfilesRepoServiceMock = Partial<ProfilesRepoService> & {
  getProfile: jest.Mock;
  upsertProfile: jest.Mock;
};

const mockProfilesRepoService: ProfilesRepoServiceMock = {
  getProfile: jest.fn(),
  upsertProfile: jest.fn(),
};

const mockProfile: IProfile = {
  id: 'profile-1',
  name: 'John Doe',
  email: 'john@example.com',
  linkedInUrl: 'https://linkedin.com/in/johndoe',
  githubUrl: 'https://github.com/johndoe',
  userId: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ProfilesService', () => {
  let service: ProfilesService;
  const profileSelect = {
    id: true,
    name: true,
    email: true,
    linkedInUrl: true,
    githubUrl: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProfilesService(mockProfilesRepoService as unknown as ProfilesRepoService);
  });

  describe('getProfileByUserId', () => {
    it('should return profile for a given userId', async () => {
      mockProfilesRepoService.getProfile.mockResolvedValue(mockProfile);

      const result = await service.getProfileByUserId('user-1');

      expect(result).toBe(mockProfile);
      expect(mockProfilesRepoService.getProfile).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        select: profileSelect,
      });
    });

    it('should propagate NotFoundException if profile not found', async () => {
      mockProfilesRepoService.getProfile.mockRejectedValue(
        new NotFoundException('Profile not found')
      );

      await expect(service.getProfileByUserId('user-999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('upsertProfile', () => {
    it('should upsert and return the profile', async () => {
      const dto: UpsertProfileDto = {
        name: 'John Doe',
        email: 'john@example.com',
        linkedInUrl: 'https://linkedin.com/in/johndoe',
        githubUrl: 'https://github.com/johndoe',
      };
      mockProfilesRepoService.upsertProfile.mockResolvedValue(mockProfile);

      const result = await service.upsertProfile('user-1', dto);

      expect(result).toBe(mockProfile);
      expect(mockProfilesRepoService.upsertProfile).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        create: {
          name: dto.name,
          email: dto.email,
          linkedInUrl: dto.linkedInUrl,
          githubUrl: dto.githubUrl,
          userId: 'user-1',
        },
        update: {
          name: dto.name,
          email: dto.email,
          linkedInUrl: dto.linkedInUrl,
          githubUrl: dto.githubUrl,
        },
        select: profileSelect,
      });
    });

    it('should use null for optional fields when not provided', async () => {
      const dto: UpsertProfileDto = {
        name: 'John Doe',
        email: 'john@example.com',
      };
      mockProfilesRepoService.upsertProfile.mockResolvedValue(mockProfile);

      const result = await service.upsertProfile('user-1', dto);

      expect(result).toBe(mockProfile);
      expect(mockProfilesRepoService.upsertProfile).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        create: {
          name: dto.name,
          email: dto.email,
          linkedInUrl: null,
          githubUrl: null,
          userId: 'user-1',
        },
        update: {
          name: dto.name,
          email: dto.email,
          linkedInUrl: null,
          githubUrl: null,
        },
        select: profileSelect,
      });
    });
  });
});
