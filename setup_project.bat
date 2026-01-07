@echo off
setlocal
echo ==============================================
echo      CLINICAL COSMOS - FULL PROJECT SETUP
echo ==============================================
echo.
echo This script will:
echo 1. Check for Python
echo 2. Setup Python Virtual Environment (.venv)
echo 3. Install Backend Dependencies
echo 4. Run Interactive Database Setup
echo.
pause

:: 1. Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found! Please install Python 3.9+ and add to PATH.
    pause
    exit /b 1
)

:: 2. Setup Virtual Environment
echo.
echo [1/4] Setting up Virtual Environment...
cd backend
if not exist ".venv" (
    echo Creating .venv...
    python -m venv .venv
) else (
    echo .venv already exists.
)

:: Activate Venv
call .venv\Scripts\activate
if %errorlevel% neq 0 (
    echo [ERROR] Failed to activate virtual environment.
    pause
    exit /b 1
)

:: 3. Install Dependencies
echo.
echo [2/4] Installing Dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies.
    pause
    exit /b 1
)

cd ..

:: 4. Run DB Setup
echo.
echo [3/4] Starting Interactive Database Setup...
cd SETUP_DB
python interactive_setup.py

echo.
echo ==============================================
echo          FULL SETUP COMPLETE!
echo ==============================================
echo.
echo To run the application:
echo 1. cd backend
echo 2. .venv\Scripts\activate
echo 3. uvicorn app.main:app --reload
echo.
pause
