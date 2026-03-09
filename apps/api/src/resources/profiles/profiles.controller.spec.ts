<<<<<<< Updated upstream
// Must mock @my-monorepo/database before any module that transitively imports
// the Prisma generated client (which uses import.meta — ESM-only, incompatible with Jest CJS)
jest.mock('@my-monorepo/database', () => ({}));
=======
jest.mock('@my-monorepo/database', () => ({
  ProfilesService: class {},
}));

>>>>>>> Stashed changes
jest.mock('./profiles.service');

import { ForbiddenException } from '@nestjs/common';
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
  const authReq = { user: { userId: 'user-1', email: 'john@example.com' } };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ProfilesController(mockProfilesService as unknown as ProfilesService);
  });

  describe('getProfileByUserId', () => {
    it('should return a profile for a given userId', async () => {
      mockProfilesService.getProfileByUserId.mockResolvedValue(mockProfile);

      const result = await controller.getProfileByUserId('user-1', authReq);

      expect(result).toBe(mockProfile);
      expect(mockProfilesService.getProfileByUserId).toHaveBeenCalledWith('user-1');
    });

    it('should throw ForbiddenException when accessing another user profile', async () => {
      await expect(controller.getProfileByUserId('user-2', authReq)).rejects.toThrow(
        ForbiddenException
      );
      expect(mockProfilesService.getProfileByUserId).not.toHaveBeenCalled();
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

      const result = await controller.upsertProfile('user-1', authReq, dto);

      expect(result).toBe(mockProfile);
      expect(mockProfilesService.upsertProfile).toHaveBeenCalledWith('user-1', dto);
    });

    it('should throw ForbiddenException when updating another user profile', async () => {
      const dto: UpsertProfileDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      };

      await expect(controller.upsertProfile('user-2', authReq, dto)).rejects.toThrow(
        ForbiddenException
      );
      expect(mockProfilesService.upsertProfile).not.toHaveBeenCalled();
    });
  });
});
