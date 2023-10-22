import { resolve } from 'path';

export const DOMAINS_REGEX = RegExp(/(vk\.com|youtube\.com|dzen\.ru)/);
export const YTDL_PATH = resolve(process.cwd(), 'storage', 'yt-dlp.exe');

export const VK_VIDEO_NAME = './storage/video.mp4';

export const DZEN_VIDEO_NAME = './storage/videoD.mp4';

export const START_CMD_MESSAGE =
  'Hi! I will help you download videos from YouTube, VK, Dzen';

export const HELP_CMD_MESSAGE = 'Just send me link';

export const ERROR_MESSAGE = 'Something went wrong';
