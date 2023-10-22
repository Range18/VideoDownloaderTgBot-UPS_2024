import { resolve } from 'path';

export const DOMAINS_REGEX = RegExp(/(vk\.com|youtube\.com|dzen\.ru)/);
export const YTDL_PATH = resolve(process.cwd(), 'bin', 'yt-dlp.exe');

export const STORAGE_PATH = resolve(process.cwd(), 'storage');

export const VK_VIDEO_NAME = resolve(STORAGE_PATH, 'videoVK.mp4');

export const DZEN_VIDEO_NAME = resolve(STORAGE_PATH, 'videoDZEN.mp4');

export const START_CMD_MESSAGE =
  'Hi! I will help you download videos from YouTube, VK, Dzen';

export const HELP_CMD_MESSAGE = 'Just send me link';

export const ERROR_MESSAGE = 'Something went wrong';
