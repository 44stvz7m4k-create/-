@echo off
title Nyami Music v59 DEV
cd /d "%~dp0"
cls
echo ========================================
echo   Nyami Music v59 - DEV
echo ========================================
echo.
echo Site: http://127.0.0.1:5000
echo Hidden admin: http://127.0.0.1:5000/#admin
echo.
echo Tip: copy .env.example to .env to configure keys.
echo.
where python >nul 2>nul
if %errorlevel%==0 (
  python server.py
) else (
  py server.py
)
echo.
pause
