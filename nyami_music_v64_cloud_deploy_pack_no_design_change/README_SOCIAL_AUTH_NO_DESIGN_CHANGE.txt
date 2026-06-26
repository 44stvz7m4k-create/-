NYAMI MUSIC v47 — Google/Apple social auth, no design change

Что НЕ добавлено:
- обход YouTube/Spotify/рекламы/защиты;
- скачивание музыки с платформ;
- небезопасные хаки.

Что добавлено:
- Google OAuth / OpenID Connect login;
- Apple Sign in with Apple login;
- /api/auth/social/config;
- /api/auth/google/start;
- /api/auth/google/callback;
- /api/auth/apple/start;
- /api/auth/apple/callback;
- таблица social_accounts;
- автосоздание/линковка пользователя по email;
- отдельный JS/CSS слой social-auth-v57.js/css;
- дизайн основного сайта не изменён.

Переменные окружения для Google:
set GOOGLE_CLIENT_ID=...
set GOOGLE_CLIENT_SECRET=...

Redirect URI в Google Console:
http://127.0.0.1:5000/api/auth/google/callback

Переменные окружения для Apple:
set APPLE_CLIENT_ID=...
set APPLE_CLIENT_SECRET=...

Redirect URI в Apple Developer:
http://127.0.0.1:5000/api/auth/apple/callback

Важно для Apple:
APPLE_CLIENT_SECRET — это заранее сгенерированный JWT client_secret для Sign in with Apple.

Запуск:
1. Распакуй архив
2. При необходимости задай env-переменные
3. Запусти START_WINDOWS.bat
4. Открой сайт

Админка:
http://127.0.0.1:5000/#admin
