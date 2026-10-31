@echo off
title Uzhavan Hub (உழவன் ஹப்) — Smart Agriculture Platform
color 0A
echo =================================================================
echo        UZHAVAN HUB (உழவன் ஹப்) — SMART AGRICULTURE
echo   Complete Full-Stack AI Agriculture Platform for Tamil Nadu
echo =================================================================
echo.
echo Starting Uzhavan Hub Relational Backend on http://localhost:5000 ...
echo.

cd /d "%~dp0"
start "" http://localhost:5000
node server/server.js

pause
