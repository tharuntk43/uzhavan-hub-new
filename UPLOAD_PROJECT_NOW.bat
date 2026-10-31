@echo off
title Uzhavan Hub - Uploading to GitHub...
color 0A

echo ===================================================================
echo   UZHAVAN HUB - UPLOADING FILES TO GITHUB
echo   Repository: https://github.com/thrun-kumar/uzhavan-Hub
echo ===================================================================
echo.

cd /d "%~dp0"

echo Current Git Remote:
git remote -v
echo.

echo Sending your project files to GitHub branch main...
echo (If a browser window pops up, click 'Sign in with your browser')
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================================
    echo   [SUCCESS!] All project files are now uploaded to GitHub!
    echo.
    echo   GitHub Pages is now building your website automatically.
    echo   In about 60 seconds, open your live link:
    echo   https://thrun-kumar.github.io/uzhavan-Hub/
    echo ===================================================================
) else (
    echo.
    echo [ERROR] Git push did not complete. 
    echo Please see the message above for details.
)

echo.
echo Press any key to close this window...
pause >nul
