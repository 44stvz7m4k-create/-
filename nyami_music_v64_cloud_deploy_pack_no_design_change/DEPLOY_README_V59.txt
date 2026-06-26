NYAMI MUSIC v59 — финальный deploy checklist

1. Перед деплоем:
   - поменять NYAMI_OWNER_PASSWORD;
   - создать .env из .env.example;
   - проверить, что data/ и uploads/ будут persistent;
   - сделать Export в админке.

2. OAuth:
   - заменить redirect URI с 127.0.0.1 на домен;
   - Google callback: /api/auth/google/callback;
   - Apple callback: /api/auth/apple/callback.

3. Нельзя заливать в публичный GitHub:
   - .env;
   - реальную SQLite базу;
   - OAuth secrets;
   - Apple private keys/JWT secrets;
   - загруженные copyrighted треки без прав.

4. Старт:
   - локально: START_WINDOWS.bat;
   - prod-like Windows: START_PROD_WINDOWS.bat;
   - server/platform: python server.py;
   - Procfile: web: python server.py.

5. Проверить после деплоя:
   - /
   - /api/health
   - /#admin
   - /api/tracks
   - загрузка трека;
   - создание аккаунта;
   - создание плейлиста;
   - Universal Search;
   - Export content.

6. Важно:
   Этот сервер подходит как MVP/локальный/self-hosted проект.
   Для большого продакшена лучше вынести на нормальный backend stack:
   reverse proxy, HTTPS, backups, monitoring, separate object storage.
