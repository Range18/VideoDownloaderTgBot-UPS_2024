import { BotService } from './bot.service.js';
import { databaseConfig } from './config.js';
import { DatabaseService } from './database.service.js';
import {stat, mkdir} from 'fs/promises'
import {DZEN_VIDEO_NAME, STORAGE_PATH} from "./constants.js";

export const database = new DatabaseService(databaseConfig);

async function bootstrap() {
  await stat('storage').catch(async (err)=> {
      if('code' in err && err.code === 'ENOENT')  return await mkdir(STORAGE_PATH)

      throw err;
  })

  const bot = new BotService();

  await database.connect();

  await bot.launch();
}

bootstrap().then(() => console.log('Bot started'));
