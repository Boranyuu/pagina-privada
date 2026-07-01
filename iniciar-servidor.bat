@echo off
set "PATH=%USERPROFILE%\nodejs-portable\node-v24.18.0-win-x64;%PATH%"
echo Iniciando servidor...
echo.
echo Abri la pagina en: http://localhost:3000
echo Desde el movil (misma WiFi): http://192.168.0.x:3000
echo.
echo Presiona Ctrl+C para detener el servidor
echo.
node server.js
pause
