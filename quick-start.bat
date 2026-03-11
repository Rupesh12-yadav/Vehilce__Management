@echo off
echo ========================================
echo  Vehicle Management System - Quick Start
echo ========================================
echo.

echo [1/4] Starting MongoDB...
echo Make sure MongoDB is running!
echo.

echo [2/4] Seeding Database...
cd backend
call node seedDB.js
if %errorlevel% neq 0 (
    echo ERROR: Database seeding failed!
    pause
    exit /b 1
)
echo Database seeded successfully!
echo.

echo [3/4] Starting Backend Server...
start "Backend Server" cmd /k "npm start"
timeout /t 5 /nobreak >nul
echo.

echo [4/4] Starting Frontend...
cd ..\frontend
start "Frontend Server" cmd /k "npm start"
echo.

echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Super Admin Login:
echo Email: admin@vehiclerental.com
echo Password: password123
echo.
echo Press any key to exit...
pause >nul
