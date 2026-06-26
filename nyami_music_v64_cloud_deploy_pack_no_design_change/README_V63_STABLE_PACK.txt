NYAMI MUSIC v63 — Stable Pack, no design change

Что сделано:
1. Добавлен health-check endpoint: GET /api/health.
2. Добавлен admin runtime report: GET /api/admin/runtime-report.
3. Добавлен маленький frontend-слой stable-pack-v63.js/css для просмотра runtime report.
4. Обновлён service worker cache до v63.
5. Добавлены базовые security headers: X-Content-Type-Options, Referrer-Policy, X-Frame-Options.
6. Проведён синтаксический тест всех JS и server.py.
7. Проведён runtime smoke test запуска сервера и /api/health.

Новые файлы:
- stable-pack-v63.js
- stable-pack-v63.css
- README_V63_STABLE_PACK.txt
- STABLE_REPORT_V63.json

Новые endpoints:
- GET /api/health
- GET /api/admin/runtime-report

Дизайн:
- style.css не изменялся;
- основной layout не переписывался;
- плееры, карточки, меню и профиль глобально не менялись;
- добавлен только отдельный v63 layer.

Запуск:
START_WINDOWS.bat
