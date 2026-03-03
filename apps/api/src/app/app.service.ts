import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string; timestamp: Date } {
    return {
      message: 'Welcome to the API!',
      timestamp: new Date(),
    };
  }

  getHealth(): { status: string; uptime: number } {
    return {
      status: 'ok',
      uptime: process.uptime(),
    };
  }
}
