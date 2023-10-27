## Описание

Телеграм бот для скачивания видео с youtube.com, vk.com, dzen.ru для Уральской проектной смены. Сделан на основе telegraf.js и использует [telegram bot api.](https://github.com/tdlib/telegram-bot-api)
Протестировать бота можно по [ссылке.](https://t.me/Keron_downloaderBot) 
## Что за  API_ID и API_HASH ?

Чтобы бот смог отправлять файлы до 2GB, он должен отправлять запросы через локальное api. Подробнее об этом [здесь.](https://core.telegram.org/api/obtaining_api_id)

## Установка зависимостей

```bash
$ yarn install
```

## Запуск приложения

```bash
# build 
$ yarn run build

# run
$ yarn run start

# watch mode
$ yarn run start:dev
```
