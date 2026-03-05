jest.mock('@my-monorepo/database', () => ({
  ProfilesService: class {},
}));

import { NotFoundException } from '@nestjs/common';
import { IProfile } from '@my-monorepo/types';
import { ProfilesService as ProfilesRepoService } from '@my-monorepo/database';

import { ProfilesService } from './profiles.service';
import { UpsertProfileDto } from './dtos/profile.dto';

type ProfilesRepoServiceMock = Partial<ProfilesRepoService> & {
  getProfileByUserId: jest.Mock;
  upsertProfile: jest.Mock;
};

const mockProfilesRepoService: ProfilesRepoServiceMock = {
  getProfileByUserId: jest.fn(),
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

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProfilesService(mockProfilesRepoService as unknown as ProfilesRepoService);
  });

  describe('getProfileByUserId', () => {
    it('should return profile for a given userId', async () => {
      mockProfilesRepoService.getProfileByUserId.mockResolvedValue(mockProfile);

      const result = await service.getProfileByUserId('user-1');

      expect(result).toBe(mockProfile);
      expect(mockProfilesRepoService.getProfileByUserId).toHaveBeenCalledWith('user-1');
    });

    it('should propagate NotFoundException if profile not found', async () => {
      mockProfilesRepoService.getProfileByUserId.mockRejectedValue(
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
      expect(mockProfilesRepoService.upsertProfile).toHaveBeenCalledWith('user-1', dto);
    });
  });
});
