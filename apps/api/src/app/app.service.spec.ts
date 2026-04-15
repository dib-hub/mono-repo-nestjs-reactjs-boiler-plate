import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '@src/app/app.service';
import { LoggerService } from '@src/common/logger/logger.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
          },
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
