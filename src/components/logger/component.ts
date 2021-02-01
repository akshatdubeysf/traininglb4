import {Component, ProviderMap} from '@loopback/core';
import {LOG_BINDINGS} from './keys';
import {LogActionProvider} from './providers/log.provider';

export class LogComponent implements Component {
  providers?: ProviderMap = {
    [LOG_BINDINGS.LOG_ACTION.key]: LogActionProvider,
  };
}
