@echo off
title YUZUKI Japan College - Exam & Quiz Platform
color 0C

echo ======================================================================
echo       ?? YUZUKI JAPAN COLLEGE - EXAMINATION & QUIZ PLATFORM ??
echo                    ????????? ? Online Exam System
echo ======================================================================
echo.
echo [1/3] Checking Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\Program Files\nodejs\node.exe" (
        set "PATH=C:\Program Files\nodejs;%PATH%"
    ) else (
        echo [ERROR] Node.js is not found! Please install Node.js to run this application.
        pause
        exit /b 1
    )
)

echo [2/3] Initializing and starting YUZUKI Exam Server...
cd /d "%~dp0backend"

echo.
echo ======================================================================
echo   Starting server at http://localhost:5000
echo   - Admin Login:    admin@yuzuki.college   / password: admin123
echo   - Sample Student: student@yuzuki.college / password: student123
echo                     (Student ID: YZ-2026-001)
echo ======================================================================
echo.

start "" "http://localhost:5000"
node src/server.js
pause
