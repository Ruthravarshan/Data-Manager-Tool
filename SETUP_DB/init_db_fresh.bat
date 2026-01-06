@echo off
echo ==========================================
echo   CLINICAL COSMOS - FRESH DATABASE SETUP
echo ==========================================
echo.
echo This script will:
echo 1. Create the database (if missing)
echo 2. Create all tables from code
echo 3. Seed initial data
echo.
echo ⚠️  WARNING: This does NOT import your backup. It creates a brand new DB.
echo.
pause

echo.
echo [1/3] Setting up PostgreSQL Database...
python setup_postgres_db.py

echo.
echo [2/3] Creating Tables...
python create_db.py

echo.
echo [3/3] Seeding Data...
python seed_db.py

echo.
echo ==========================================
echo         SETUP COMPLETE!
echo ==========================================
echo You can now run the backend.
pause
