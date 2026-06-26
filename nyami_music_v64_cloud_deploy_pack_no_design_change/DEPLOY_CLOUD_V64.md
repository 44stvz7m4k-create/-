# Nyami Music v64 — Cloud Deploy Guide

Эта версия подготовлена для деплоя на Render, Railway, Docker/VPS.

## Главное

В v64 добавлены переменные для persistent storage:

```env
NYAMI_STORAGE_DIR=storage
NYAMI_DATA_DIR=storage/data
NYAMI_UPLOADS_DIR=storage/uploads
NYAMI_MUSIC_DIR=storage/uploads/music
NYAMI_COVERS_DIR=storage/uploads/covers
NYAMI_DB_PATH=storage/data/nyami.sqlite3
```

Обычно достаточно указать только:

```env
NYAMI_STORAGE_DIR=...
```

Сайт сам создаст:

```txt
data/
uploads/music/
uploads/covers/
```

внутри выбранного storage.

## Проверка после деплоя

Открой:

```txt
https://YOUR_DOMAIN/api/health
```

Должно быть:

```json
{
  "ok": true,
  "build": "v64-cloud-deploy-pack"
}
```

Админка:

```txt
https://YOUR_DOMAIN/#admin
```

## Render

1. Залей проект на GitHub.
2. На Render выбери `New -> Web Service`.
3. Подключи GitHub repo.
4. Build Command:

```bash
pip install -r requirements.txt
```

5. Start Command:

```bash
python server.py
```

6. Environment variables:

```env
NYAMI_HOST=0.0.0.0
NYAMI_NO_OPEN=1
NYAMI_STORAGE_DIR=/opt/render/project/src/storage
NYAMI_OWNER_LOGIN=admin
NYAMI_OWNER_PASSWORD=CHANGE_ME
```

7. Добавь Persistent Disk:

```txt
Mount path: /opt/render/project/src/storage
Size: 1GB+
```

Также можно использовать `render.yaml`.

## Railway

1. Залей проект на GitHub.
2. Railway -> New Project -> Deploy from GitHub.
3. Variables:

```env
NYAMI_HOST=0.0.0.0
NYAMI_NO_OPEN=1
NYAMI_STORAGE_DIR=/app/storage
NYAMI_OWNER_LOGIN=admin
NYAMI_OWNER_PASSWORD=CHANGE_ME
```

4. Добавь Volume и примонтируй его в:

```txt
/app/storage
```

`railway.json` и `nixpacks.toml` уже добавлены.

## Docker / VPS

Локально:

```bash
docker compose up --build
```

Открой:

```txt
http://localhost:5000
```

На VPS:

```bash
git clone YOUR_REPO
cd YOUR_REPO
cp .env.cloud.example .env
nano .env
docker compose up -d --build
```

## Важно по музыке

Для публичного сайта не загружай чужие mp3 без прав.

Безопасные источники:

- свои треки;
- direct legal audio;
- Jamendo;
- Internet Archive;
- YouTube/Spotify/SoundCloud только через official embed/preview.

## OAuth после деплоя

Поменяй redirect URI:

```txt
https://YOUR_DOMAIN/api/auth/google/callback
https://YOUR_DOMAIN/api/auth/apple/callback
```

## Backup

Перед обновлениями делай backup папки storage:

```txt
storage/data/nyami.sqlite3
storage/uploads/music/
storage/uploads/covers/
```
