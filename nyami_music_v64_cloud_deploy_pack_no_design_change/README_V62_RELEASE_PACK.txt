NYAMI MUSIC v62 — release pack, no design change

Добавлено:
1. Splash/loading screen.
2. Offline page для PWA: offline.html.
3. Публичные ссылки на плейлисты.
4. Lyrics: ручное хранение текста песни через backend.
5. Artist pages: мини-страницы артистов.
6. Onboarding для новых пользователей.

Новые endpoints:
POST /api/playlists/{id}/share
DELETE /api/playlists/{id}/share
GET /api/public-playlists/{share_id}
GET /api/lyrics/{track_key}
POST /api/lyrics
GET /api/artists
GET /api/artists/{artist}

Новые таблицы:
playlist_shares
track_lyrics

Новые файлы:
release-pack-v62.js
release-pack-v62.css
offline.html
README_V62_RELEASE_PACK.txt

Дизайн:
- style.css не изменялся;
- основной layout не переписан;
- плееры визуально не менялись;
- карточки/меню/профиль глобально не менялись;
- все визуальные добавки изолированы в release-pack-v62.css.

Запуск:
START_WINDOWS.bat
