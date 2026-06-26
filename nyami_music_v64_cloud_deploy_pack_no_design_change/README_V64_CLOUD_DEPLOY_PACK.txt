NYAMI MUSIC v64 — Cloud Deploy Pack, no design change

Добавлено:
- persistent storage env paths;
- Dockerfile;
- docker-compose.yml;
- .dockerignore;
- render.yaml;
- railway.json;
- nixpacks.toml;
- .env.cloud.example;
- render.env.example;
- railway.env.example;
- START_CLOUD_LOCAL_WINDOWS.bat;
- START_DOCKER_WINDOWS.bat;
- MIGRATE_LOCAL_TO_STORAGE_V64.bat;
- DEPLOY_CLOUD_V64.md;
- CLOUD_DEPLOY_REPORT_V64.json.

Исправлено:
- /api/health теперь вызывает полный health-check;
- добавлены алиасы UPLOAD_MUSIC_DIR / UPLOAD_COVERS_DIR;
- сервер не открывает браузер на cloud host;
- storage можно вынести в persistent disk/volume.

Дизайн:
- style.css не изменялся;
- layout не переписывался;
- плееры/карточки/меню/профиль визуально не менялись.
