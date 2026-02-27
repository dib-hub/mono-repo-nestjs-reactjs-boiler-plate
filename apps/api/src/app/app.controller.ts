import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { REST_RESOURCE } from '@my-monorepo/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(REST_RESOURCE.HEALTH)
  getHealth() {
    return this.appService.getHealth();
  }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get(REST_RESOURCE.USERS)
  getUsers() {
    return this.appService.getUsers();
  }
}
