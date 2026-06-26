@echo off
cd /d "%~dp0"
set NYAMI_HOST=0.0.0.0
set NYAMI_PORT=5000
set NYAMI_NO_OPEN=1
set NYAMI_STORAGE_DIR=storage
if not exist storage mkdir storage
if not exist storage\data mkdir storage\data
if not exist storage\uploads mkdir storage\uploads
if not exist storage\uploads\music mkdir storage\uploads\music
if not exist storage\uploads\covers mkdir storage\uploads\covers
python server.py
pause
