import { Controller, Get } from '@nestjs/common';
import { REST_RESOURCE } from '@my-monorepo/types';
import { AppService } from '@src/app/app.service';
import { Public } from '@src/common/guards/public.decorator';
import { LoggerService } from '@src/common/logger/logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService
  ) {}

  @Public()
  @Get(REST_RESOURCE.HEALTH)
  getHealth(): { status: string; uptime: number } {
    this.logger.log('Handling health check request', AppController.name);
    return this.appService.getHealth();
  }

  @Public()
  @Get()
  getData(): { message: string; timestamp: Date } {
    this.logger.log('Handling root API request', AppController.name);
    return this.appService.getData();
  }
}
