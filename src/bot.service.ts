import { Context, Input, Telegraf } from 'telegraf';
import { botConfig } from './config.js';
import ytdl from 'ytdl-core';
import { message } from 'telegraf/filters';
import * as child_process from 'child_process';
import { createReadStream } from 'fs';
import { unlink } from 'node:fs/promises';
import {
  DOMAINS_REGEX,
  DZEN_VIDEO_NAME,
  ERROR_MESSAGE,
  HELP_CMD_MESSAGE,
  START_CMD_MESSAGE,
  VK_VIDEO_NAME,
  YTDL_PATH,
} from './constants.js';
import fetch from 'node-fetch';
import { database } from './main.js';
import { ObjectLiteral, Repository } from 'typeorm';
import { VideoEntity } from './video.entity.js';

export class BotService {
  private readonly BotInstance: Telegraf;

  private readonly videoRepository: Repository<ObjectLiteral>;

  constructor() {
    this.BotInstance = new Telegraf<Context>(botConfig.token);
    this.videoRepository = database.getRepository(VideoEntity);
  }

  async launch(): Promise<void> {
    this.BotInstance.start((ctx) => {
      ctx.reply(START_CMD_MESSAGE);
    });

    this.BotInstance.help((ctx) => {
      ctx.reply(HELP_CMD_MESSAGE);
    });

    this.BotInstance.on(message('text'), async (ctx) => {
      try {
        const videoEntity = await this.videoRepository.findOne({
          where: { url: ctx.message.text },
        });

        if (videoEntity) {
          await ctx.sendVideo(Input.fromFileId(videoEntity.fieldId));
          return;
        }

        const domain = ctx.message.text.match(DOMAINS_REGEX);

        switch (domain?.at(0)) {
          case 'youtube.com':
            {
              const fieldId = (
                await ctx.replyWithVideo(
                  Input.fromReadableStream(ytdl(ctx.message.text)),
                )
              ).video.file_id;

              await this.videoRepository.save({
                fieldId: fieldId,
                url: ctx.message.text,
              });
            }
            break;

          case 'vk.com':
            {
              const subprocess = child_process.exec(
                `${YTDL_PATH} -o ${VK_VIDEO_NAME} ${ctx.message.text}`,
                async (error, stdout, stderr) => {
                  if (error) {
                    console.log('stderr: [SERVICE] - VK.COM', stderr);
                  }

                  console.log(stdout);
                },
              );

              subprocess.on('close', async () => {
                try {
                  const fieldId = (
                    await ctx.replyWithVideo(
                      Input.fromReadableStream(createReadStream(VK_VIDEO_NAME)),
                    )
                  ).video.file_id;

                  await this.videoRepository.save({
                    fieldId: fieldId,
                    url: ctx.message.text,
                  });

                  await unlink(VK_VIDEO_NAME);
                } catch (err) {
                  console.log(err);

                  unlink(VK_VIDEO_NAME).catch((error)=> console.log(error));

                  await ctx.reply(ERROR_MESSAGE);
                }
              });

              subprocess.on('error', async (err) => {
                console.log(err);

                unlink(VK_VIDEO_NAME).catch((error)=> console.log(error));

                await ctx.reply(ERROR_MESSAGE);
              });
            }
            break;

          case 'dzen.ru':
            {
              const streamURL = await this.extractStreamUrlDzen(
                ctx.message.text,
              );

              const subprocess = child_process.exec(
                `${YTDL_PATH} -i -o ${DZEN_VIDEO_NAME} ${streamURL}`,
                async (error, stdout, stderr) => {
                  if (error) {
                    console.log('stderr: [SERVICE] - DZEN.RU ', stderr);
                  }

                  console.log(stdout);
                },
              );

              subprocess.on('close', async () => {
                try {
                  const fieldId = (
                    await ctx.replyWithVideo(
                      Input.fromReadableStream(
                        createReadStream(DZEN_VIDEO_NAME),
                      ),
                    )
                  ).video.file_id;

                  await this.videoRepository.save({
                    fieldId: fieldId,
                    url: ctx.message.text,
                  });

                  await unlink(DZEN_VIDEO_NAME);
                } catch (err) {
                  console.log(err);

                  unlink(VK_VIDEO_NAME).catch((error)=> console.log(error));

                  await ctx.reply(ERROR_MESSAGE);
                }
              });

              subprocess.on('error', async (err) => {
                console.log(err);

                unlink(VK_VIDEO_NAME).catch((error)=> console.log(error));

                await ctx.reply(ERROR_MESSAGE);
              });
            }
            break;

          default:
            {
              await ctx.reply('Invalid url/domain');
            }
            break;
        }
      } catch (err) {
        console.log(err);

        unlink(VK_VIDEO_NAME).catch((error)=> console.log(error));

        await ctx.reply(ERROR_MESSAGE);
      }
    });

    await this.BotInstance.launch();
  }

  private async extractStreamUrlDzen(url: string): Promise<string> {
    const response = await fetch(url, { method: 'POST' });
    const data = await response.text();

    const indexOfMpd = data.indexOf('manifest.mpd');
    const lastIndexOfMpd = indexOfMpd + 1;

    let streamUrlStart = indexOfMpd;

    const streamUrlArr: string[] = [];

    while (data[streamUrlStart] !== '"') {
      streamUrlArr.unshift(data[streamUrlStart]!);
      streamUrlStart--;
    }

    let streamUrlEnd = lastIndexOfMpd;

    while (data[streamUrlEnd] !== '"') {
      streamUrlArr.push(data[streamUrlEnd]!);
      streamUrlEnd++;
    }
    return streamUrlArr.join('');
  }
}
