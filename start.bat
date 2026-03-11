@echo off
echo Starting Vehicle Rental System...
echo.

echo Step 1: Seeding Database...
cd backend
call node seedDB.js
echo.

echo Step 2: Starting Backend Server...
start cmd /k "cd backend && npm start"
timeout /t 3

echo Step 3: Starting Frontend...
start cmd /k "cd frontend && npm start"

echo.
echo ✅ Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Login Credentials:
echo Super Admin: admin@vehiclerental.com / password123
echo Vehicle Admin: rajesh@vehiclerental.com / password123
echo Driver: amit@driver.com / password123
pause
