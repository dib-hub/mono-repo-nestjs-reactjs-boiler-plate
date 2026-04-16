import { Injectable } from '@nestjs/common';
import { TraceLogger } from '@src/common/logger/logger.service';

@Injectable()
export class AppService {
  private readonly logger = new TraceLogger(AppService.name);

  getData(): { message: string; timestamp: Date } {
    this.logger.log('Preparing root API response');
    return {
      message: 'Welcome to the API!',
      timestamp: new Date(),
    };
  }

  getHealth(): { status: string; uptime: number } {
    this.logger.log('Preparing health check response');
    return {
      status: 'ok',
      uptime: process.uptime(),
    };
  }
}
