import { Controller, Get } from '@nestjs/common';
import { REST_RESOURCE } from '@my-monorepo/types';
import { AppService } from '@src/app/app.service';
import { Public } from '@src/common/guards/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get(REST_RESOURCE.HEALTH)
  getHealth(): { status: string; uptime: number } {
    return this.appService.getHealth();
  }

  @Public()
  @Get()
  getData(): { message: string; timestamp: Date } {
    return this.appService.getData();
  }
}
