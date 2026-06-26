NYAMI MUSIC v47 — Full legal tracks + self-learning AI, no design change

ВАЖНО:
- не добавлено скачивание музыки с YouTube/Spotify;
- не добавлен обход рекламы/защиты платформ;
- полные версии ищутся только там, где можно легально отдать аудио в плеер: local upload, direct audio URL, Jamendo при ключе, Internet Archive/public audio;
- YouTube/Spotify/SoundCloud остаются official embed/preview режимом.

Дизайн:
- style.css не изменялся;
- основной layout, карточки, плееры, профиль, меню не переписывались;
- добавлены только изолированные JS/CSS функции.

Что добавлено:
- GET /api/full-track-search?q=QUERY;
- GET /api/ai-profile;
- FULL/PREV переключатель в Universal Search;
- full legal search по локальным/загруженным трекам;
- full legal search по direct audio URL из базы;
- full legal search по Jamendo, если задан JAMENDO_CLIENT_ID;
- full legal search по Internet Archive/public audio;
- усиленное AI-обучение на search/play/like/skip/complete;
- таблица ai_learning_stats;
- веса источников, артистов, настроений обновляются сильнее после лайков и прослушиваний.

Опциональные ключи:
- JAMENDO_CLIENT_ID — для Jamendo полных треков;
- YOUTUBE_API_KEY — для YouTube embed-поиска;
- SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET — для Spotify embed-поиска;
- SOUNDCLOUD_CLIENT_ID — для SoundCloud поиска;
- INTERNET_ARCHIVE_ENABLED=0 — отключить Internet Archive.

Запуск:
1. Распакуй архив
2. Запусти START_WINDOWS.bat
3. Открой сайт

Админка:
http://127.0.0.1:5000/#admin

Админ:
login: admin
password: admin123
