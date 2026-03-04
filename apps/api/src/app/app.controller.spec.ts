import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Prevent Jest from loading the Prisma ESM client (incompatible with CJS test runner)
jest.mock('@my-monorepo/database', () => ({
  UsersModule: class UsersModule {},
  UsersService: class UsersService {
    findAll = jest.fn();
  },
  PrismaService: class PrismaService {},
  DatabaseModule: class DatabaseModule {},
}));

describe('AppController', () => {
  let controller: AppController;
  let appService: jest.Mocked<AppService>;

  beforeEach(async () => {
    const mockAppService: Partial<jest.Mocked<AppService>> = {
      getData: jest.fn(),
      getHealth: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    appService = module.get(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getData', () => {
    it('should return data from AppService', () => {
      const mockData = { message: 'Welcome to the API!', timestamp: new Date() };
      appService.getData.mockReturnValue(mockData);

      expect(controller.getData()).toEqual(mockData);
      expect(appService.getData).toHaveBeenCalledTimes(1);
    });
  });

  describe('getHealth', () => {
    it('should return health status from AppService', () => {
      const mockHealth = { status: 'ok', uptime: 42 };
      appService.getHealth.mockReturnValue(mockHealth);

      expect(controller.getHealth()).toEqual(mockHealth);
      expect(appService.getHealth).toHaveBeenCalledTimes(1);
    });

    it('should return status ok', () => {
      appService.getHealth.mockReturnValue({ status: 'ok', uptime: 10 });
      const result = controller.getHealth();
      expect(result.status).toBe('ok');
    });
  });
});
