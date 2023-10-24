import { BotService } from './bot.service.js';
import { botConfig, databaseConfig } from './config.js';
import { DatabaseService } from './database.service.js';
import { TELEGRAM_API_PATH } from './constants.js';
import * as child_process from 'child_process';

export const database = new DatabaseService(databaseConfig);

async function bootstrap() {
  const bot = new BotService();

  await database.connect();

  child_process.spawn(TELEGRAM_API_PATH, [
    `--app-id=${botConfig.appId}`,
    `--api-hash=${botConfig.apiHash}`,
    '--local',
  ]);

  bot
    .getInstance()
    .telegram.getMe()
    .then(() => console.log('Bot started'));

  await bot.launch();
}

bootstrap();
