/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
// jest.mock must run before the module that imports prisma.service
jest.mock('../../prisma.service', () => ({
  PrismaService: class {},
}));

import { BadRequestException } from '@nestjs/common';

import { UsersService } from './users.service';

// simple in-memory stub for prisma client
const mockPrisma: any = {
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
    service = new UsersService(mockPrisma as any);
  });

  describe('toPublicUser', () => {
    it('should strip password field and cast role', () => {
      const raw = {
        id: '1',
        email: 'a@a.com',
        firstName: 'FN',
        lastName: 'LN',
        role: 'USER',
        createdAt: new Date(0),
        updatedAt: new Date(0),
      } as any;
      const pub = (service as any).toPublicUser(raw);
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
      await expect(
        service.create({ email: 'a@a.com', firstName: '', lastName: '', password: 'pw' } as any)
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when passwords do not match', async () => {
      await expect(
        service.create({
          email: 'a@a.com',
          firstName: 'A',
          lastName: 'B',
          password: 'pw',
          confirmPassword: 'no',
        } as any)
      ).rejects.toThrow(BadRequestException);
    });
  });
});
