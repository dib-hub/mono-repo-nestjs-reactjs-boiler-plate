import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@src/app/app.controller';
import { AppService } from '@src/app/app.service';

describe('AppController', () => {
  let controller: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getData', () => {
    it('should return a welcome message and a timestamp from the real AppService', () => {
      const result = controller.getData();

      expect(result.message).toBe('Welcome to the API!');
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('getHealth', () => {
    it('should return status ok with a numeric uptime from the real AppService', () => {
      const result = controller.getHealth();

      expect(result.status).toBe('ok');
      expect(typeof result.uptime).toBe('number');
    });
  });
});
