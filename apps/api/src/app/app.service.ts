import { Injectable } from '@nestjs/common';
import { UsersService } from '@my-monorepo/database';
import { IUser } from '@my-monorepo/types';

@Injectable()
export class AppService {
  constructor(private readonly usersService: UsersService) {}

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

  getUsers(): Promise<IUser[]> {
    return this.usersService.findAll();
  }
}
