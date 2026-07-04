@echo off
REM Setup script for Network Security Scanner (Windows)

echo.
echo ==========================================
echo Network Security Scanner Setup
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed. Please install Python 3.8 or higher.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js 14 or higher.
    exit /b 1
)

echo Setting up Backend...
echo ---

cd backend

REM Create virtual environment
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install requirements
echo Installing Python dependencies...
pip install -r requirements.txt

REM Create necessary directories
if not exist "logs" mkdir logs

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo Please update .env with your configuration
)

REM Run migrations
echo Running migrations...
python manage.py migrate

echo.
echo Backend setup complete!
echo.

cd ..

echo Setting up Frontend...
echo ---

cd frontend

REM Create .env file if it doesn't exist
if not exist ".env.local" (
    echo Creating .env.local file...
    copy .env.example .env.local
    echo Please update .env.local with your configuration
)

REM Install dependencies
echo Installing Node dependencies...
npm install

echo.
echo Frontend setup complete!
echo.

cd ..

echo ==========================================
echo Setup completed successfully!
echo ==========================================
echo.
echo To start the application:
echo.
echo Backend (in one terminal):
echo   cd backend
echo   venv\Scripts\activate
echo   python manage.py runserver
echo.
echo Frontend (in another terminal):
echo   cd frontend
echo   npm start
echo.
echo Or use Docker Compose:
echo   docker-compose up
echo.
