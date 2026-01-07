@echo off
echo ==========================================
echo   CLINICAL COSMOS - FRESH DATABASE SETUP
echo ==========================================
echo.
echo This script will:
echo 1. Check/Configure database credentials (.env)
echo 2. Create the database (if missing)
echo 3. Create all tables from code
echo 4. Seed initial data
echo.
echo ⚠️  WARNING: This does NOT import your backup. It creates a brand new DB.
echo.
pause

python interactive_setup.py

pause
