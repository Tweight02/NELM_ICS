@echo off
title ICS NELM Development Servers

echo Starting Main API...
start "Main API - 8001" cmd /k "cd /d C:\Users\pc\Desktop\ICS_NELM\backend\main-api && php artisan serve --host=api.icsnelm.test --port=8001"

echo Starting Pastor API...
start "Pastor API - 8000" cmd /k "cd /d C:\Users\pc\Desktop\ICS_NELM\backend\pastor-api && php artisan serve --host=api.icsnelm.test --port=8000"

echo Starting Church API...
start "Pastor API - 8002" cmd /k "cd /d C:\Users\pc\Desktop\ICS_NELM\backend\church-api && php artisan serve --host=api.icsnelm.test --port=8002"

echo Starting Secretary API...
start "Pastor API - 8003" cmd /k "cd /d C:\Users\pc\Desktop\ICS_NELM\backend\secretary-api && php artisan serve --host=api.icsnelm.test --port=8003"

echo Starting Angular...
start "Angular - 4200" cmd /k "cd /d C:\Users\pc\Desktop\ICS_NELM\frontend && ng serve --host=app.icsnelm.test --port=4200"

echo.
echo All servers are starting...