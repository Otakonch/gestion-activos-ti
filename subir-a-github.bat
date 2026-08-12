@echo off
echo.
echo  Subir a GitHub - Gestion de Activos TI
echo  ----------------------------------------
echo.

cd /d "%~dp0"

:: Verificar que git esta instalado
git --version >nul 2>&1
if %errorlevel% neq 0 (
  echo  ERROR: Git no esta instalado o no esta en el PATH.
  echo  Descargalo en: https://git-scm.com
  pause
  exit /b 1
)

:: Inicializar repositorio si no existe
if not exist ".git" (
  echo  Inicializando repositorio git...
  git init
  git branch -M main
)

:: Agregar todos los archivos
echo  Agregando archivos...
git add .

:: Crear commit inicial
echo  Creando commit inicial...
git commit -m "Sistema de Gestion de Activos TI - Municipalidad de Coyhaique (71 registros historicos)"

:: Configurar remote (solo si no existe)
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
  echo  Configurando repositorio remoto...
  git remote add origin https://github.com/Otakonch/gestion-activos-ti.git
)

:: Subir
echo.
echo  Subiendo a GitHub...
echo  (Si te pide autenticacion, usa tu usuario y token de GitHub)
echo.
git push -u origin main

if %errorlevel% eq 0 (
  echo.
  echo  LISTO. Repositorio subido exitosamente.
  echo  URL: https://github.com/Otakonch/gestion-activos-ti
  echo.
) else (
  echo.
  echo  Si el push fallo, puede que necesites un token de acceso personal.
  echo  Ve a: GitHub - Settings - Developer settings - Personal access tokens
  echo  Crea un token con permiso "repo" y usalo como contrasena.
  echo.
)

pause
