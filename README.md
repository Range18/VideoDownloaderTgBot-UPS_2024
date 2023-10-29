# Telegram bot для скачивания видео

Телеграм бот для скачивания видео с youtube.com, vk.com, dzen.ru для Уральской проектной смены. Сделан на основе telegraf.js, использует [telegram bot api](https://github.com/tdlib/telegram-bot-api) и [PostgreSQL](https://www.postgresql.org/).

Протестировать бота можно по [ссылке](https://t.me/Keron_downloaderBot).

## Что умеет бот?

- **Скачивать видео до 2Gb** из ниже представленных сервисов:
  - YouTube (Shorts)
  - VK (Clips)
  - Dzen
- Параллельное скачивание (бот может обслуживать несколько людей одновременно)
- Кеширование уже отправленных кому-то видео (моментальная отправка уже скачанных ранее видео)

## Установка

1. Переименовать .env.example в .env

2. Заполнить следующие поля:
    - TOKEN - уникальный токен бота
    - APP_ID и API_HASH - Чтобы бот смог отправлять файлы до 2GB, он должен отправлять запросы через локальное api. Подробнее об этом [здесь](https://core.telegram.org/api/obtaining_api_id)
    - DB_NAME - имя базы данных
    - DB_USER - пользователь базы данных
    - DB_PASSWORD - пароль от DB_USER

3. Запустить команду:

```bash
npm run boot
```

## Запуск приложения

```bash
# build 
npm run build

# run
npm run start

# watch mode
npm run start:dev
```
