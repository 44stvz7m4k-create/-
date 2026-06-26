NYAMI MUSIC v47/v59 — product pack, no design change

Добавлено всё из следующего пакета:
1. Админка: редактирование треков/источников.
2. Профиль: серверная статистика пользователя.
3. Рекомендации: блок For you.
4. Экспорт/импорт контента базы.
5. Подготовка к деплою: DEPLOY_README_V59.txt.

Дизайн:
- style.css не изменялся;
- основной layout не переписан;
- нижний/правый плеер визуально не менялись;
- карточки, меню, профиль не менялись глобально;
- новые функции вынесены в admin-tools-v59 и product-polish-v59.

Новые endpoints:
PUT /api/admin/tracks/{id}
GET /api/admin/export-content
POST /api/admin/import-content
GET /api/user-stats
GET /api/recommendations

Админка:
http://127.0.0.1:5000/#admin

Админ:
login: admin
password: admin123
