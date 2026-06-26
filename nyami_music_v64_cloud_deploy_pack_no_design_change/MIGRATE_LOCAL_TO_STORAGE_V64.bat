@echo off
cd /d "%~dp0"
echo Copying local data/ and uploads/ to storage/ ...
if not exist storage mkdir storage
if not exist storage\data mkdir storage\data
if not exist storage\uploads mkdir storage\uploads
xcopy data storage\data /E /I /Y
xcopy uploads storage\uploads /E /I /Y
echo Done.
pause
