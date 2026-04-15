import { Injectable } from '@nestjs/common';
import { LoggerService } from '@src/common/logger/logger.service';

@Injectable()
export class AppService {
  constructor(private readonly logger: LoggerService) {}

  getData(): { message: string; timestamp: Date } {
    this.logger.log('Preparing root API response', AppService.name);
    return {
      message: 'Welcome to the API!',
      timestamp: new Date(),
    };
  }

  getHealth(): { status: string; uptime: number } {
    this.logger.log('Preparing health check response', AppService.name);
    return {
      status: 'ok',
      uptime: process.uptime(),
    };
  }
}
