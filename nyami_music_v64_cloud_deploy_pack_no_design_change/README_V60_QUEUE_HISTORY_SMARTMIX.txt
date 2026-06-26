NYAMI MUSIC v60 — Queue + History + Smart Mix, no design change

Что добавлено:
- очередь воспроизведения;
- Play next;
- Add to queue;
- Clear queue;
- история прослушивания;
- очистка истории;
- Smart Mix по текущему треку;
- добавление Smart Mix в очередь;
- AI учитывает play/history/skip через существующие события;
- серверная таблица listening_history.

Новые endpoints:
GET /api/history
POST /api/history
DELETE /api/history
POST /api/smart-mix

Дизайн:
- style.css не изменялся;
- основной layout не переписан;
- плееры визуально не менялись;
- карточки/меню/профиль не менялись глобально;
- добавлен отдельный слой queue-history-v60.js/css.

Запуск:
START_WINDOWS.bat
