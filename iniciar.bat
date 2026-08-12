@echo off
echo.
echo  Gestion de Activos TI - Municipalidad de Coyhaique
echo  ---------------------------------------------------
echo.

cd /d "%~dp0"

if exist "node_modules\express" goto :start

echo  Instalando dependencias...
if exist "node_modules" rmdir /s /q "node_modules"
if exist "package-lock.json" del /q "package-lock.json"

call npm install
if %errorlevel% neq 0 (
  echo.
  echo  ERROR: npm install fallo.
  echo  Verifica que Node.js esta instalado: https://nodejs.org
  pause
  exit /b 1
)

:start
echo  Servidor iniciando en http://localhost:3000
echo.
start "" "http://localhost:3000"
node server.js
pause
