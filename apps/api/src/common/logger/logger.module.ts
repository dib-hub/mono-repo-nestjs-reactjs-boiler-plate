import { Global, Module } from '@nestjs/common';

import { TraceLogger } from './logger.service';

@Global()
@Module({
  providers: [TraceLogger],
  exports: [TraceLogger],
})
export class LoggerModule {}
