import pkg from 'env-var';
const { get } = pkg;
import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';
import { VideoEntity } from './video.entity.js';

export const botConfig = {
  token: get('TOKEN').required().asString(),
};

export const databaseConfig: DataSourceOptions = {
  port: get('DB_PORT').required().asPortNumber(),
  host: get('DB_HOST').default('localhost').asString(),
  database: get('DB_NAME').required().asString(),
  username: get('DB_USER').required().asString(),
  password: get('DB_PASSWORD').required().asString(),
  synchronize: get('DB_SYNC').default('false').asBool(),
  dropSchema: get('DB_DROP').default('false').asBool(),
  type: 'postgres',
  entities: [VideoEntity],
};
