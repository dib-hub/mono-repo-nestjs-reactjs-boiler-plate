import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '@my-monorepo/database';
import { IUser } from '@my-monorepo/types';
import { CreateUserDto } from '@my-monorepo/types';

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

  async getUserById(id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
