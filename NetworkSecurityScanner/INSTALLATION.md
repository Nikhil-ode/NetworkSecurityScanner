# Installation & Troubleshooting Guide

## Verification Checklist

Before starting, verify your system meets requirements:

- [ ] Python 3.8+ installed (`python --version`)
- [ ] Node.js 14+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (optional) (`git --version`)

## 📋 Pre-Installation Setup

### 1. Clone or Download Project

```bash
# Option A: If using Git
git clone <repository-url>
cd NetworkSecurityScanner

# Option B: If downloaded as ZIP
unzip NetworkSecurityScanner.zip
cd NetworkSecurityScanner
```

### 2. Verify Project Structure

```bash
# You should see these directories:
backend/
frontend/
docs/
logs/ (may not exist yet)

# And these files:
README.md
docker-compose.yml
.gitignore
setup.sh / setup.bat
```

##

 🚀 Installation Methods

### Method 1: Automated Setup (Recommended)

## On Windows

```bash
setup.bat
```

## On macOS/Linux

```bash
chmod +x setup.sh
./setup.sh
```

The script will:

1. Check Python and Node.js installation
2. Create virtual environment
3. Install all dependencies
4. Run database migrations
5. Create logs directory

### Method 2: Manual Setup (Step by Step)

#### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create Python virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Install Python dependencies
pip install -r requirements.txt

# 5. Create logs directory
mkdir logs

# 6. Configure environment
# Copy the example file
cp .env.example .env
# Edit .env if needed (optional - defaults work for development)
# nano .env  (or your preferred editor)

# 7. Apply database migrations
python manage.py migrate

# 8. (Optional) Create a superuser for admin panel
python manage.py createsuperuser
# Follow the prompts to create admin account

# 9. Verify setup
python verify_setup.py
# This will check all configurations

# 10. Start backend server
python manage.py runserver
# Server will be at http://localhost:8000
```

#### Frontend Setup

```bash
# 1. Open a NEW terminal/command window

# 2. Navigate to frontend
cd frontend

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local if needed (optional for development)

# 4. Install Node dependencies
npm install
# This may take 3-5 minutes

# 5. Start frontend development server
npm start
# Browser should automatically open to http://localhost:3000
```

### Method 3: Docker Setup (Fastest)

```bash
# From project root directory
docker-compose up

# This starts:
# - Backend at http://localhost:8000
# - Frontend at http://localhost:3000
# - Database (PostgreSQL)
# - Redis
# - Celery worker

# In another terminal, run migrations:
docker-compose exec backend python manage.py migrate

# Create superuser:
docker-compose exec backend python manage.py createsuperuser
```

## 🧪 Testing Your Installation

### 1. Test Backend

```bash
# Check if server is running
curl http://localhost:8000/api/auth/users/me/

# Expected: 403 Forbidden (because not authenticated)
# If you get connection refused, backend is not running
```

### 2. Test Frontend

```bash
# Check if UI loads
# Open http://localhost:3000 in browser
# Should see login page
```

### 3. Test Login

1. Go to <http://localhost:3000>
2. If you created superuser, login with those credentials
3. Or login with test credentials (if configured)
4. You should see the Dashboard

### 4. Test Scan

1. Go to Dashboard
2. Enter an IP: `8.8.8.8` or `1.1.1.1` (public IPs)
3. Click "Start Scan"
4. Results should appear within 10-30 seconds

### 5. Run Verification Script

```bash
cd backend
python verify_setup.py
```

You should see all checks marked with ✓

## 🔧 Troubleshooting

### Backend Issues

#### Python Not Found

```bash
# Install Python from https://www.python.org/downloads/
# Then restart your terminal
```

#### Module Not Found Error

```bash
# Make sure virtual environment is activated
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Then reinstall requirements
pip install -r requirements.txt
```

#### "Port 8000 Already in Use"

```bash
# Run on different port
python manage.py runserver 8080

# Update frontend .env.local:
REACT_APP_API_URL=http://localhost:8080/api
```

#### Database Lock Error

```bash
# Delete database and recreate
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

#### Migrations Not Applied

```bash
# Apply pending migrations
python manage.py migrate

# Check migration status
python manage.py showmigrations
```

#### Celery Not Working (Scans Won't Run)

```bash
# Option 1: Install Redis
# Windows: https://github.com/microsoftarchive/redis/releases
# macOS: brew install redis
# Linux: sudo apt-get install redis-server

# Start Redis:
# Windows: redis-server
# macOS/Linux: redis-server

# Option 2: For development, disable Celery
# Comment out run_scan_task.delay() in backend/apps/scans/views.py
# And run synchronously instead
```

#### CORS Error in Browser

```python
Access to XMLHttpRequest blocked by CORS policy
```

Solution:

1. Check backend is running
2. Verify CORS_ALLOWED_ORIGINS in backend/.env or settings.py
3. Ensure frontend URL is included:

   ```python
   CORS_ALLOWED_ORIGINS=http://localhost:3000
   ```

4. Restart backend

### Frontend Issues

#### Node Modules Not Found

```bash
cd frontend
npm install
```

#### "Port 3000 Already in Use"

```bash
# Linux/macOS:
PORT=3001 npm start

# Windows (Command Prompt):
set PORT=3001
npm start

# Or kill process using port 3000:
# macOS/Linux: lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
# Windows: netstat -ano | findstr :3000
```

#### "Cannot GET /"

```bash
# Frontend build failed or not running
# Solution:
cd frontend
npm install
npm start
```

#### Login Not Working

1. Check backend is running on <http://localhost:8000>
2. Check .env.local has correct API URL
3. Check browser console (F12) for errors
4. Try with test credentials (admin/admin if created)

#### "Cannot find module" errors

```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json  # On Windows: del package-lock.json
npm install
npm start
```

### General Issues

#### Still Getting Errors?

1. **Check Logs**:
   - Backend: `backend/logs/app.log`
   - Frontend: Browser console (F12)
   - Docker: `docker-compose logs -f`

2. **Run Verification**:

   ```bash
   cd backend
   python verify_setup.py
   ```

3. **Reinstall Everything**:

   ```bash
   # Backend
   cd backend
   rm -rf venv
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   
   # Frontend
   cd ../frontend
   rm -rf node_modules package-lock.json
   npm install
   npm start
   ```

4. **Check System Resources**:

   ```bash
   # Make sure you have at least:
   # - 2GB free disk space
   # - 1GB available RAM
   # - Internet connection for npm/pip
   ```

## 📝 Common Configuration

### To use different database

Edit `backend/.env`:

```env
# SQLite (default)
DATABASE_URL=sqlite:///db.sqlite3

# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# MySQL
DATABASE_URL=mysql://user:password@localhost:3306/dbname
```

### To enable email notifications

Edit `backend/.env`:

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

## ✨ Verification Success

If you can:

1. ✓ Access <http://localhost:3000> (Frontend)
2. ✓ Access <http://localhost:8000/admin> (Admin panel)
3. ✓ Login successfully
4. ✓ Create and run a scan
5. ✓ View scan results

**Your installation is complete and working!** 🎉

## 📚 Next Steps

1. Read [QUICKSTART.md](QUICKSTART.md) for usage guide
2. Read [docs/API.md](docs/API.md) for API documentation
3. Configure additional features in [docs/SETUP.md](docs/SETUP.md)
4. Deploy to production using [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## 🆘 Still Having Issues?

Check these resources in order:

1. **[QUICKSTART.md](QUICKSTART.md)** - Quick reference guide
2. **[docs/SETUP.md](docs/SETUP.md)** - Detailed setup guide
3. **[docs/API.md](docs/API.md)** - API documentation
4. **[README.md](README.md)** - Project overview
5. **Logs**:
   - Backend: `backend/logs/app.log`
   - Browser console: Press F12 in browser
   - Docker logs: `docker-compose logs`

## 📞 Support

- Check GitHub Issues for similar problems
- Review error messages in logs carefully
- Search online for specific error messages
- Create detailed issue report with:
  - Your OS and Python/Node versions
  - Full error message
  - Steps to reproduce
  - Relevant log excerpts

Happy scanning! 🔒
