import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@my-monorepo/database';

import { AppService } from './app.service';

// Prevent Jest loading the Prisma ESM client
jest.mock('@my-monorepo/database', () => ({
  UsersModule: class UsersModule {},
  UsersService: class UsersService {
    findAll = jest.fn();
  },
  PrismaService: class PrismaService {},
  DatabaseModule: class DatabaseModule {},
}));

describe('AppService', () => {
  let service: AppService;
  let usersService: { findAll: jest.Mock };

  beforeEach(async () => {
    usersService = { findAll: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getData', () => {
    it('should return a welcome message and a timestamp', () => {
      const result = service.getData();
      expect(result.message).toBe('Welcome to the API!');
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('getHealth', () => {
    it('should return status ok with a numeric uptime', () => {
      const result = service.getHealth();
      expect(result.status).toBe('ok');
      expect(typeof result.uptime).toBe('number');
    });
  });
});
