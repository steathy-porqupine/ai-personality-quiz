@echo off
echo Starting AI Personality Quiz...
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting server...
echo Quiz will be available at: http://localhost:3000
echo.
call npm start
pause

