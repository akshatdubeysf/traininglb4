import {BindingKey} from '@loopback/core';
import {LogFn, LogWriterFn} from './types';

/**
 * Binding keys used by this component.
 */
export namespace LOG_BINDINGS {
  export const APP_LOG_LEVEL = BindingKey.create<LOG_LEVEL>(
    'example.log.level',
  );
  export const LOGGER = BindingKey.create<LogWriterFn>('example.log.logger');
  export const LOG_ACTION = BindingKey.create<LogFn>('example.log.action');
}

/**
 * Enum to define the supported log levels
 */
export enum LOG_LEVEL {
  DEBUG,
  INFO,
  WARN,
  ERROR,
  OFF,
}
