import env from 'env-var';
import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';
import { VideoEntity } from './video.entity.js';

export const botConfig = {
  token: env.get('TOKEN').required().asString(),
  appId: env.get('APP_ID').required().asInt(),
  apiHash: env.get('API_HASH').required().asString(),
};

export const databaseConfig: DataSourceOptions = {
  port: env.get('DB_PORT').required().asPortNumber(),
  host: env.get('DB_HOST').default('localhost').asString(),
  database: env.get('DB_NAME').required().asString(),
  username: env.get('DB_USER').required().asString(),
  password: env.get('DB_PASSWORD').required().asString(),
  synchronize: env.get('DB_SYNC').default('false').asBool(),
  dropSchema: env.get('DB_DROP').default('false').asBool(),
  type: 'postgres',
  entities: [VideoEntity],
};
