import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData() {
    return {
      message: 'Welcome to the API!',
      timestamp: new Date(),
    };
  }

  getHealth() {
    return {
      status: 'ok',
      uptime: process.uptime(),
    };
  }
}
