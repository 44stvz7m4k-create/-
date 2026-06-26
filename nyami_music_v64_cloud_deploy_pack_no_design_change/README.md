# Nyami Music v59 — Deploy Ready

Музыкальный сайт с сохранённым текущим дизайном и добавленной функциональностью.

## Важно по дизайну

Основной дизайн не менялся:

- `style.css` не изменён;
- основной layout не переписан;
- нижний и правый плеер визуально не менялись;
- карточки, меню, профиль и адаптив не переписывались;
- новые функции вынесены в отдельные JS/CSS-слои.

## Что внутри

- скрытая админка: `/#admin`;
- загрузка треков;
- редактирование треков/источников;
- Universal Search;
- full legal search;
- AI-вкус;
- cookies;
- PWA;
- Google / Apple login;
- серверные плейлисты;
- профильная статистика;
- For you;
- экспорт / импорт контента;
- deploy-ready структура.

## Быстрый запуск на Windows

1. Распакуй архив.
2. Запусти:

```bat
START_WINDOWS.bat
```

3. Открой:

```txt
http://127.0.0.1:5000
```

Админка:

```txt
http://127.0.0.1:5000/#admin
```

Дефолтный админ:

```txt
login: admin
password: admin123
```

Перед публикацией поменяй пароль в `.env`.

## Настройка env

Скопируй:

```txt
.env.example
```

в:

```txt
.env
```

И измени значения:

```env
NYAMI_OWNER_LOGIN=admin
NYAMI_OWNER_PASSWORD=your_strong_password
```

## OAuth redirect URI

Google:

```txt
http://127.0.0.1:5000/api/auth/google/callback
```

Apple:

```txt
http://127.0.0.1:5000/api/auth/apple/callback
```

На продакшене заменить `127.0.0.1:5000` на домен сайта.

## Деплой

Для хостинга добавлены:

- `requirements.txt`;
- `Procfile`;
- `runtime.txt`;
- `.env.example`;
- `.gitignore`;
- `DEPLOY_README_V59.txt`.

Команда запуска:

```bash
python server.py
```

Хостинг должен хранить эти папки постоянно:

```txt
data/
uploads/music/
uploads/covers/
```

## Экспорт перед обновлением

В админке есть Export / Import.

Или открыть:

```txt
/api/admin/export-content
```

после входа в админку.
