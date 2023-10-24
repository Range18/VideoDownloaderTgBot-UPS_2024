import { resolve } from 'path';

export const DOMAINS_REGEX = RegExp(
  /(vk\.com|youtube\.com|dzen\.ru|youtu\.be)/,
);
export const YTDL_PATH = resolve(process.cwd(), 'bin', 'yt-dlp.exe');

export const TELEGRAM_API_PATH = resolve(
  process.cwd(),
  'bin',
  'telegram-bot-api.exe',
);

export const TELEGRAM_API_LOGS = resolve(process.cwd(), 'temp');

export const START_CMD_MESSAGE =
  'Привет, я помогу скачать тебе видео или сторис с <b>YouTube, VK, Dzen</b>' +
  '\nПросто отправь мне ссылку на ресурс';

export const INVALID_URL_MESSAGE =
  'Неправильные домен или ссылка. Скачивание возможно только с youtube.com (youtu.be), vk.com, dzen.ru';

export const ERROR_MESSAGE = 'Что-то пошло не так :/';
