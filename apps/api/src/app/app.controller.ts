import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { IUser, REST_RESOURCE } from '@my-monorepo/types';
import { CreateUserDto } from '@my-monorepo/types';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(REST_RESOURCE.HEALTH)
  getHealth(): { status: string; uptime: number } {
    return this.appService.getHealth();
  }

  @Get()
  getData(): { message: string; timestamp: Date } {
    return this.appService.getData();
  }

  @Get(REST_RESOURCE.USERS)
  getUsers(): Promise<IUser[]> {
    return this.appService.getUsers();
  }

  @Get(`${REST_RESOURCE.USERS}/:id`)
  getUserById(@Param('id') id: string) {
    return this.appService.getUserById(id);
  }

  @Post(REST_RESOURCE.USERS)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.appService.createUser(createUserDto);
  }

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.appService.createUser(createUserDto);
  }
}
