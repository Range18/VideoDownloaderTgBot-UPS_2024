import { BotService } from './bot.service.js';
import * as console from 'console';
import { databaseConfig } from './config.js';
import { DatabaseService } from './database.service.js';

export const database = new DatabaseService(databaseConfig);

async function bootstrap() {
  const bot = new BotService();

  await database.connect();

  await bot.launch();
}

bootstrap().then(() => console.log('Bot started'));
