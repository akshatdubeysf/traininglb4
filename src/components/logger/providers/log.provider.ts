import {inject, Provider} from '@loopback/context';
import winston, {createLogger, format, transports} from 'winston';
import {LOG_BINDINGS, LOG_LEVEL} from '../keys';
import {
  LogFn,
  LogWriterFn
} from '../types';

export class LogActionProvider implements Provider<LogFn> {
  // LogWriteFn is an optional dependency and it falls back to `logToConsole`
  @inject(LOG_BINDINGS.LOGGER, {optional: true})
  private logWriter: LogWriterFn = this.logToConsole;
  winston: winston.Logger;

  @inject(LOG_BINDINGS.APP_LOG_LEVEL, {optional: true})
  private logLevel: number = LOG_LEVEL.WARN;

  constructor(
  ) {
    this.winston = createLogger({
      format: format.json(),
      transports: [
        new transports.File({filename: 'error.log', level: 'error'}),
        new transports.File({filename: 'combined.log'}),
      ],
    })
  }

  value(): LogFn {
    return (str: string, level?: number) => {
      this.action(str, level);
    }
  }

  private action(
    str: string,
    level?: number
  ): void {
    if (
      this.logLevel !== LOG_LEVEL.OFF
    ) {
      this.logWriter(str, level || this.logLevel);
    }
  }

  logToConsole(msg: string, level: number) {
    switch (level) {
      case LOG_LEVEL.DEBUG:
        this.winston.debug(msg);
        break;
      case LOG_LEVEL.INFO:
        this.winston.info(msg);
        break;
      case LOG_LEVEL.WARN:
        this.winston.warn(msg);
        break;
      case LOG_LEVEL.ERROR:
        this.winston.error(msg);
        break;
    }
  }
}


