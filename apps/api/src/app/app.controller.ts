import { Controller, Get } from '@nestjs/common';
import { REST_RESOURCE } from '@my-monorepo/types';
import { AppService } from '@src/app/app.service';
import { Public } from '@src/common/guards/public.decorator';
import { TraceLogger } from '@src/common/logger/logger.service';

@Controller()
export class AppController {
  private readonly logger = new TraceLogger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Public()
  @Get(REST_RESOURCE.HEALTH)
  getHealth(): { status: string; uptime: number } {
    this.logger.log('Handling health check request');
    return this.appService.getHealth();
  }

  @Public()
  @Get()
  getData(): { message: string; timestamp: Date } {
    this.logger.log('Handling root API request');
    return this.appService.getData();
  }
}
