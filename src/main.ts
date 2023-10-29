import { BotService } from './bot.service.js';
import { botConfig, databaseConfig } from './config.js';
import { DatabaseService } from './database.service.js';
import { TELEGRAM_API_PATH } from './constants.js';
import * as child_process from 'child_process';

export const database = new DatabaseService(databaseConfig);

async function bootstrap() {
  const bot = new BotService();

  await database.connect();

  //start telegram bot api
 const apiProcess =  child_process.spawn(
    `${TELEGRAM_API_PATH}`, [`--api-id=${botConfig.appId}`, `--api-hash=${botConfig.apiHash}`, '--local']
  );

  apiProcess.on('error', (error)=> {
    console.log(error);
    throw new Error('Error: Telegram bot api is not started');
  })

  bot
    .getInstance()
    .telegram.getMe()
    .then(() => console.log('Bot is started')).then(() => bot.launch());

  process.once('SIGINT', () => bot.getInstance().stop('SIGINT'));
  process.once('SIGTERM', () => bot.getInstance().stop('SIGTERM'));
}

bootstrap();
