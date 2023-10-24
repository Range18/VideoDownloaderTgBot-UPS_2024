import { BotService } from './bot.service.js';
import { botConfig, databaseConfig } from './config.js';
import { DatabaseService } from './database.service.js';
import { TELEGRAM_API_LOGS, TELEGRAM_API_PATH } from './constants.js';
import * as child_process from 'child_process';

export const database = new DatabaseService(databaseConfig);

async function bootstrap() {
  const bot = new BotService();

  await database.connect();

  //start telegram bot api
  child_process.exec(
    `${TELEGRAM_API_PATH} --api-id=${botConfig.appId} --api-hash=${botConfig.apiHash} --local`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        throw new Error('Error: Telegram bot api is not started');
      }
    },
  );

  bot
    .getInstance()
    .telegram.getMe()
    .then(() => console.log('Bot is started'));

  await bot.launch();
}

bootstrap();
