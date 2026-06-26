@echo off
title Nyami Music v59 PROD
cd /d "%~dp0"
cls
echo ========================================
echo   Nyami Music v59 - PROD-LIKE
echo ========================================
echo.
echo Uses NYAMI_HOST=0.0.0.0 and PORT/NYAMI_PORT.
echo Set secrets in .env before start.
echo.
set NYAMI_HOST=0.0.0.0
if "%NYAMI_PORT%"=="" set NYAMI_PORT=5000
where python >nul 2>nul
if %errorlevel%==0 (
  python server.py
) else (
  py server.py
)
echo.
pause
