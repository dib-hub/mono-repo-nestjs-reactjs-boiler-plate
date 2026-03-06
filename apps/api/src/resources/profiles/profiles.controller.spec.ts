// Must mock @my-monorepo/database before any module that transitively imports
// the Prisma generated client (which uses import.meta — ESM-only, incompatible with Jest CJS)
jest.mock('@my-monorepo/database', () => ({}));
jest.mock('./profiles.service');

import { IProfile } from '@my-monorepo/types';

import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { UpsertProfileDto } from './dtos/profile.dto';

type ProfilesServiceMock = Partial<ProfilesService> & {
  getProfileByUserId: jest.Mock;
  upsertProfile: jest.Mock;
};

const mockProfilesService: ProfilesServiceMock = {
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

describe('ProfilesController', () => {
  let controller: ProfilesController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ProfilesController(mockProfilesService as unknown as ProfilesService);
  });

  describe('getProfileByUserId', () => {
    it('should return a profile for a given userId', async () => {
      mockProfilesService.getProfileByUserId.mockResolvedValue(mockProfile);

      const result = await controller.getProfileByUserId('user-1');

      expect(result).toBe(mockProfile);
      expect(mockProfilesService.getProfileByUserId).toHaveBeenCalledWith('user-1');
    });
  });

  describe('upsertProfile', () => {
    it('should upsert and return the updated profile', async () => {
      const dto: UpsertProfileDto = {
        name: 'John Doe',
        email: 'john@example.com',
        linkedInUrl: 'https://linkedin.com/in/johndoe',
        githubUrl: 'https://github.com/johndoe',
      };
      mockProfilesService.upsertProfile.mockResolvedValue(mockProfile);

      const result = await controller.upsertProfile('user-1', dto);

      expect(result).toBe(mockProfile);
      expect(mockProfilesService.upsertProfile).toHaveBeenCalledWith('user-1', dto);
    });
  });
});
