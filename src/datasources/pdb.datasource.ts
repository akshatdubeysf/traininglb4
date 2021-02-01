import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  name: 'pdb',
  connector: process.env.DB_CONNECTOR,
  url: process.env.DB_URL,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class PdbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'pdb';
  static readonly defaultConfig = config;
  constructor(
    @inject('datasources.config.pdb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
