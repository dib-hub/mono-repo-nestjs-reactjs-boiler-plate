jest.mock('../../prisma.service', () => ({
  PrismaService: class {},
}));

import { BadRequestException } from '@nestjs/common';
import { IUser, CreateUserDto } from '@my-monorepo/types';

import { PrismaService } from '../../prisma.service';
import { UsersService } from './users.service';

// Shape of the private toPublicUser input (mirrors what Prisma returns via select)
type RawUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

// Standalone interface for accessing private methods in tests
// (cannot intersect with UsersService because toPublicUser is private)
interface ServiceWithPrivates {
  toPublicUser: (raw: RawUser) => IUser;
}

// Typed stub for PrismaService
type MockPrismaService = {
  user: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
  };
};

const mockPrisma: MockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UsersService(mockPrisma as unknown as PrismaService);
  });

  describe('toPublicUser', () => {
    it('should strip password field and cast role', () => {
      const raw: RawUser = {
        id: '1',
        email: 'a@a.com',
        firstName: 'FN',
        lastName: 'LN',
        role: 'USER',
        createdAt: new Date(0),
        updatedAt: new Date(0),
      };
      const pub = (service as unknown as ServiceWithPrivates).toPublicUser(raw);
      expect(pub).toEqual({
        id: '1',
        email: 'a@a.com',
        firstName: 'FN',
        lastName: 'LN',
        role: 'USER',
        createdAt: new Date(0),
        updatedAt: new Date(0),
      });
    });
  });

  describe('create', () => {
    it('should throw when firstName or lastName missing', async () => {
      const dto: CreateUserDto = { email: 'a@a.com', firstName: '', lastName: '', password: 'pw' };
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw when passwords do not match', async () => {
      const dto: CreateUserDto = {
        email: 'a@a.com',
        firstName: 'A',
        lastName: 'B',
        password: 'pw',
        confirmPassword: 'no',
      };
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });
});
