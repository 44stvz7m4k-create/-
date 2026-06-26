NYAMI MUSIC v47 — Universal Search, без изменения дизайна

КРИТИЧЕСКОЕ УСЛОВИЕ:
- основной дизайн не переписан;
- style.css не изменён;
- существующие layout/card/player/profile/menu классы не переименованы;
- новый функционал добавлен отдельными файлами universal-search-v54.js/css и backend routes.

Изученная структура проекта:
{
  "design_css": [
    "style.css",
    "auth-v47.css",
    "admin-v48.css",
    "server-tracks-v48.css"
  ],
  "main_html": "index.html",
  "main_search": "index.html: #searchBox, #searchInput, #searchPopover, #searchResultList",
  "right_player": "index.html: #rightPlayerPanel, #nowCover, #nowTitle, #nowArtist, #nowProgress",
  "bottom_player": "index.html: #bottomPlayerPanel, #bottomCover, #bottomTitle, #bottomArtist, #bottomProgress",
  "profile": "index.html: #profileOpenBtn, #profileDropdown, #profileModal",
  "auth": "auth-v47.js / auth-v47.css",
  "admin": "admin-v48.js / admin-v48.css / hidden route #admin",
  "backend": "server.py"
}

Что добавлено:
- GET /api/universal-search?q=QUERY
- POST /api/play-event
- POST /api/like-external-track
- POST /api/cookie-consent
- POST /api/reset-ai-profile
- iTunes Preview search работает без ключа;
- Jamendo search работает при JAMENDO_CLIENT_ID;
- YouTube search работает при YOUTUBE_API_KEY через официальный embed;
- Spotify search работает при SPOTIFY_CLIENT_ID/SPOTIFY_CLIENT_SECRET через официальный embed;
- SoundCloud URL/widget работает через официальный виджет; поиск требует SOUNDCLOUD_CLIENT_ID;
- audio/preview источники играют через текущий audio player;
- YouTube/Spotify/SoundCloud открываются iframe внутри существующей зоны правого плеера;
- нижний плеер обновляет название/артиста/источник без изменения внешнего вида;
- AI-вкус сохраняет события только после cookie-согласия 'Принять + AI вкус';
- 'Только нужные' не сохраняет вкусы/историю;
- добавлен сброс AI-профиля в существующее меню профиля;
- добавлен компактный блок 'Скоро будет!' на существующих классах.

Запуск:
1. Распакуй архив
2. Запусти START_WINDOWS.bat
3. Открой сайт

Админка:
http://127.0.0.1:5000/#admin

Админ:
login: admin
password: admin123
