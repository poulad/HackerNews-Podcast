import { Injectable, Logger, Scope } from '@nestjs/common';
import { LogEvent } from './log-event';

export const LOG_EVENTS_QUEUE: LogEvent[] = [];

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends Logger {
  error(message: any, trace?: string, context?: string) {
    super.error(message, trace, context);
    LOG_EVENTS_QUEUE.push({
      '@timestamp': new Date().toISOString(),
      level: 'error',
      trace,
      context: context || this.context,
      message,
    });
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
    LOG_EVENTS_QUEUE.push({
      '@timestamp': new Date().toISOString(),
      level: 'warn',
      context: context || this.context,
      message,
    });
  }

  info(message: any, context?: string) {
    super.log(message, context);
    LOG_EVENTS_QUEUE.push({
      '@timestamp': new Date().toISOString(),
      level: 'info',
      context: context || this.context,
      message,
    });
  }

  log(message: any, context?: string) {
    return this.info(message, context);
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
    LOG_EVENTS_QUEUE.push({
      '@timestamp': new Date().toISOString(),
      level: 'debug',
      context: context || this.context,
      message,
    });
  }

  verbose(message: any, context?: string) {
    super.verbose(message, context);
    LOG_EVENTS_QUEUE.push({
      '@timestamp': new Date().toISOString(),
      level: 'verbose',
      context: context || this.context,
      message,
    });
  }
}
