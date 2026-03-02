import { Controller, Get } from '@nestjs/common';
import { IUser, REST_RESOURCE } from '@my-monorepo/types';

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
}
