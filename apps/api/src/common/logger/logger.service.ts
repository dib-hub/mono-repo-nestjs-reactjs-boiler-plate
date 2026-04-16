import { Logger, LoggerService } from '@nestjs/common';

export class TraceLogger extends Logger implements LoggerService {
  override log(message: unknown, ...optionalParams: unknown[]): void {
    super.log(`${message}`, ...optionalParams);
  }

  override warn(message: unknown, ...optionalParams: unknown[]): void {
    super.warn(`${message}`, ...optionalParams);
  }

  override error(message: unknown, ...optionalParams: unknown[]): void {
    super.error(`${message}`, ...optionalParams);
  }

  override debug(message: unknown, ...optionalParams: unknown[]): void {
    super.debug(`${message}`, ...optionalParams);
  }

  override verbose(message: unknown, ...optionalParams: unknown[]): void {
    super.verbose(`${message}`, ...optionalParams);
  }
}
