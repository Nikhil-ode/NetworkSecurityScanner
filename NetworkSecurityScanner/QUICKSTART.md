# Quick Start Guide

## Prerequisites

Before starting, ensure you have:

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn
- Git (optional)

## Option 1: Quick Manual Setup

### Backend Setup (5-10 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create logs directory
mkdir logs

# Configure environment variables
cp .env.example .env
# Edit .env with your settings (optional - defaults work for development)

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

The backend will be available at: **<http://localhost:8000>**

API documentation: **<http://localhost:8000/api/>**

Admin panel: **<http://localhost:8000/admin/>** (login with superuser credentials)

### Frontend Setup (5-10 minutes)

Open a new terminal and run:

```bash
# Navigate to frontend
cd frontend

# Configure environment variables
cp .env.example .env.local
# Edit .env.local if needed

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will automatically open at: **<http://localhost:3000>**

## Option 2: Docker Setup (Fastest)

```bash
# From the root directory
docker-compose up
```

This will start:

- Backend on <http://localhost:8000>
- Frontend on <http://localhost:3000>
- Database (PostgreSQL)
- Redis

## Option 3: Automated Setup Script

### On macOS/Linux

```bash
chmod +x setup.sh
./setup.sh
```

### On Windows

```bash
setup.bat
```

## Testing the Application

### 1. Create a Scan

1. Open <http://localhost:3000> in your browser
2. Click "Get Started" or go to `/login`
3. Log in with credentials:
   - **Username**: admin
   - **Password**: admin (if you created superuser with these credentials)
4. Go to Dashboard
5. Enter an IP address (e.g., `192.168.1.1` or `8.8.8.8`) in the "Start New Scan" form
6. Click "Start Scan"

### 2. View Scan Results

- Scans will appear in the "Recent Scans" list
- Click on a scan to view detailed results
- Results show open ports, services, and vulnerabilities

### 3. View All Scans

- Navigate to the "Scans" page
- View all scans with their status and timestamps

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**

```bash
python manage.py runserver 8080
# Then update frontend .env.local:
REACT_APP_API_URL=http://localhost:8080/api
```

**Module not found:**

```bash
# Ensure virtual environment is activated
pip install -r requirements.txt
```

**Database errors:**

```bash
# Reset the database
python manage.py flush
python manage.py migrate
```

### Frontend Issues

**Port 3000 already in use:**

```bash
PORT=3001 npm start
```

**Module not found:**

```bash
npm install
```

**API connection issues:**

- Check that backend is running on <http://localhost:8000>
- Verify `.env.local` has correct `REACT_APP_API_URL`
- Check browser console for errors

## Common Commands

### Backend

```bash
# Create new migration
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
python manage.py test

# Shell access
python manage.py shell

# Collect static files
python manage.py collectstatic
```

### Frontend

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Format code
npm run format
```

### Docker

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Execute command in container
docker-compose exec backend python manage.py migrate
```

## API Endpoints

### Authentication

- `POST /api/auth/users/` - Login
- `GET /api/auth/users/me/` - Get current user

### Scans

- `GET /api/scans/` - List all scans
- `POST /api/scans/` - Create new scan
- `GET /api/scans/{id}/` - Get scan details
- `GET /api/scans/{id}/results/` - Get scan results
- `POST /api/scans/{id}/start/` - Start a scan

### Reports

- `GET /api/reports/` - List reports
- `GET /api/reports/{id}/` - Get report details
- `GET /api/reports/{id}/download/` - Download report

### Vulnerabilities

- `GET /api/vulnerabilities/` - List vulnerabilities
- `GET /api/vulnerabilities/by_severity/` - Filter by severity

## Project Structure

```plaintext
NetworkSecurityScanner/
├── backend/
│   ├── apps/
│   │   ├── users/      # User management
│   │   ├── scans/      # Scan operations
│   │   ├── reports/    # Report generation
│   │   └── vulnerabilities/  # Vulnerability tracking
│   ├── services/       # Business logic
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── docs/
    ├── API.md
    ├── SETUP.md
    ├── DATABASE.md
    └── DEPLOYMENT.md
```

## Next Steps

1. **Customize Settings**: Edit `backend/.env` with your configuration
2. **Configure Database**: For production, set up PostgreSQL
3. **Set up Redis**: For Celery task queue (optional for development)
4. **Add Supabase**: Configure Supabase integration in settings
5. **Deploy**: Follow `docs/DEPLOYMENT.md` for production deployment

## Support

For more detailed documentation, see:

- [API Documentation](docs/API.md)
- [Database Guide](docs/DATABASE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Setup Guide](docs/SETUP.md)

## Common Issues & Solutions

### Issue: CORS errors in browser console

**Solution:**

1. Check backend is running
2. Verify `CORS_ALLOWED_ORIGINS` in `backend/scanner_project/settings.py`
3. Update to include your frontend URL

### Issue: "Cannot POST /api/scans/"

**Solution:**

1. Ensure you're logged in
2. Check that auth token is saved in localStorage
3. Verify token is being sent in request headers

### Issue: Scans not running

**Solution:**

1. Celery requires Redis to be running
2. For development, you can modify the scan task to run synchronously
3. Check logs in `backend/logs/app.log`

## Support & Feedback

Need help? Check the logs:

- Backend: `backend/logs/app.log`
- Frontend: Browser console (F12)

For issues and feature requests, please create an issue on GitHub.
