import { Injectable } from '@nestjs/common';
import { UsersService } from '@my-monorepo/database';

@Injectable()
export class AppService {
  constructor(private readonly usersService: UsersService) {}

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

  getUsers() {
    return this.usersService.findAll();
  }
}
