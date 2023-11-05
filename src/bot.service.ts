import { Context, Input, Telegraf } from 'telegraf';
import { botConfig } from './config.js';
import { message } from 'telegraf/filters';
import * as child_process from 'child_process';
import {
  DOMAINS_REGEX,
  ERROR_MESSAGE,
  INVALID_URL_MESSAGE,
  START_CMD_MESSAGE,
  YTDL_PATH,
} from './constants.js';
import { database } from './main.js';
import { ObjectLiteral, Repository } from 'typeorm';
import { VideoEntity } from './video.entity.js';
import axios from 'axios';
import FormData from 'form-data';

export class BotService {
  private readonly BotInstance: Telegraf;

  private readonly videoRepository: Repository<ObjectLiteral>;

  private readonly userRequests: Set<number>;

  constructor() {
    this.BotInstance = new Telegraf<Context>(botConfig.token);

    this.userRequests = new Set<number>();

    this.videoRepository = database.getRepository(VideoEntity);
  }

  async launch(): Promise<void> {
    this.BotInstance.start((ctx) => {
      ctx.replyWithHTML(START_CMD_MESSAGE);
    });

    this.BotInstance.on(message('text'), async (ctx) => {
      if (this.isRequestInProcess(ctx.chat.id)) {
        ctx.reply('Ваш запрос в обработке. Пожалуйста подождите...');
        return;
      }

      this.addUserRequest(ctx.chat.id);

      const videoEntity = await this.videoRepository.findOne({
        where: { url: ctx.message.text },
      });

      if (videoEntity) {
        await ctx.sendVideo(Input.fromFileId(videoEntity.fieldId));
        this.removeUserRequest(ctx.chat.id);
        return;
      }

      const isAllowed = DOMAINS_REGEX.test(ctx.message.text);

      if (isAllowed) {
        const url = ctx.message.text;

        if (!url) {
          ctx.reply(INVALID_URL_MESSAGE);
          this.removeUserRequest(ctx.chat.id);
          return;
        }

        const subprocess = child_process.spawn(`${YTDL_PATH}`, [
          '-o',
          '-',
          '--no-playlist',
          url,
        ]);

        const videoData: Uint8Array[] = [];

        subprocess.stdout.on('data', (chunk) => {
          videoData.push(chunk);
        });

        subprocess.on('error', async (error) => {
          console.log('Something went wrong at subprocess downloading video');
          console.log(error);

          this.removeUserRequest(ctx.chat.id);

          await ctx.reply(ERROR_MESSAGE);
        });

        //Showing the process of downloading in bot`s console
        subprocess.stderr.on('data', (data) => {
          console.log(data.toString());
        });

        subprocess.on('close', async () => {
          const formData = new FormData();

          formData.append('chat_id', String(ctx.chat.id));
          formData.append('video', Buffer.concat(videoData), {
            filename: 'video.mp4',
          });
          formData.append('supports_streaming', 'true');

          try {
            const response = await axios.postForm(
              `http://127.0.0.1:8081/bot${botConfig.token}/sendVideo`,
              formData,
            );

            //Caching video
            if (response.data?.ok) {
              await this.videoRepository.save({
                fieldId: response.data?.result?.video?.file_id,
                url: ctx.message.text,
              });
            }

            this.removeUserRequest(ctx.chat.id);
          } catch (error) {
            console.log('Something went wrong uploading video');
            console.log(error);

            this.removeUserRequest(ctx.chat.id);

            await ctx.reply(ERROR_MESSAGE);
          }
        });
      } else {
        this.removeUserRequest(ctx.chat.id);

        await ctx.reply(INVALID_URL_MESSAGE);
      }
    });

    await this.BotInstance.launch();
  }

  getInstance() {
    return this.BotInstance;
  }

  private isRequestInProcess(chatId: number): boolean {
    return this.userRequests.has(chatId);
  }

  private addUserRequest(chatId: number): void {
    this.userRequests.add(chatId);
  }

  private removeUserRequest(chatId: number): void {
    this.userRequests.delete(chatId);
  }
}
