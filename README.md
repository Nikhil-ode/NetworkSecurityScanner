# 🔒 Network Security Scanner

A comprehensive web-based network security scanning and vulnerability detection system built with **Django** (backend) and **React** (frontend). It performs port scanning, service fingerprinting, vulnerability assessment, and generates detailed security reports.

---

## Features

- **Port Scanning** — Identify open ports and running services on target systems via socket-based TCP scanning
- **Vulnerability Detection** — Detect high-risk ports, database exposures, email service leaks, and web service weaknesses
- **Detailed Reports** — Generate comprehensive security reports in PDF, HTML, and JSON formats
- **Real-time Monitoring** — Track scan progress and view results in real-time
- **User Authentication** — Secure login and registration with JWT authentication (Supports Supabase integration)
- **Scan History** — View, filter, and manage past scan results
- **Docker Support** — Full containerized deployment with PostgreSQL, Redis, Celery, and Celery Beat

---

## Technology Stack

### Backend
| Technology | Purpose |
| ---------- | ------- |
| **Django** | Web framework & ORM |
| **Django REST Framework** | RESTful API development |
| **Celery + Redis** | Asynchronous task processing & brokering |
| **Simple JWT** | Token-based authentication |
| **Supabase PostgreSQL** | Cloud database (via Supavisor pooler) |
| **Daphne** | ASGI server for production |

### Frontend
| Technology | Purpose |
| ---------- | ------- |
| **React** | User interface library |
| **React Router** | Client-side routing |
| **Axios** | HTTP client for API calls |
| **Modern CSS** | Gradient themes, animations, responsive design |

### Infrastructure
| Technology | Purpose |
| ---------- | ------- |
| **Docker & Docker Compose** | Containerized deployment |
| **PostgreSQL** | Relational database |
| **Redis** | Cache & message broker |

---

## Project Structure

```
NetworkSecurity Scanner/
├── apps/                       # Django application modules
│   ├── reports/                # Report generation logic
│   ├── scans/                  # Scan operations & management
│   ├── users/                  # User authentication & management
│   └── vulnerabilities/        # Vulnerability tracking & detection
├── config/                     # Django project configuration
│   ├── settings.py             # Settings (DB, auth, CORS, etc.)
│   ├── urls.py                 # Root URL configuration
│   ├── asgi.py / wsgi.py       # ASGI & WSGI entry points
│   └── celery.py               # Celery task queue config
├── services/                   # Core scanning & detection services
│   ├── scanner.py              # Socket-based TCP port scanner
│   └── vulnerability_detector.py  # Vulnerability identification
├── NetworkSecurityScanner/     # Frontend + alternative backend
│   ├── frontend/               # React application (src/, public/)
│   ├── backend/                # Standalone Django backend with Dockerfile
│   └── docs/                   # Extended documentation
├── logs/                       # Application log files
├── staticfiles/                # Collected static assets
├── manage.py                   # Django management script
├── run_https.py                # HTTPS development server launcher
├── requirements_backup.txt     # Python dependencies
├── start_project.bat           # Windows setup script
└── .env                        # Environment variables (credentials)
```

---

## Quick Start

### Prerequisites

- Python 3.14+
- Node.js 24+
- npm
- Supabase account (for cloud database)
- PostgreSQL client (psql) — optional, for migrations

---

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to **Project Settings** > **Database**
3. Copy your credentials:
   - **Project ID** (from URL or Database settings)
   - **Database Password**
   - **Connection Pooler** (Supavisor) connection string
4. Configure `.env` in the project root:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Supabase PostgreSQL via Supavisor Connection Pooler
USE_SQLITE=False
DB_NAME=postgres
DB_USER=postgres.<your-project-id>
DB_PASSWORD=<your-database-password>
DB_HOST=aws-1-ap-northeast-1.pooler.supabase.com
DB_PORT=5432
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

> **Important:** Replace `<your-project-id>` and `<your-database-password>` with your actual Supabase credentials.

5. Run database migrations:

```bash
# Option 1: Using Django management command
python manage.py migrate

# Option 2: Using Supabase SQL Editor
# Run the SQL migration files from apps/*/migrations/ in Supabase SQL Editor
```

---

### Backend Setup

```bash
# 1. Activate virtual environment
venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements_backup.txt

# 3. Start the backend server (HTTPS)
python run_https.py
```

The backend will be available at **`https://localhost:8443`**

---

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd NetworkSecurityScanner/frontend

# 2. Install dependencies
npm install

# 3. Start the development server (HTTPS)
npm start
```

The frontend will be available at **`https://localhost:3000`**

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login/` | User login |
| `POST` | `/api/auth/register/` | User registration |
| `GET` | `/api/auth/users/me/` | Get current user |
| `POST` | `/api/auth/jwt/create/` | Create JWT token |
| `POST` | `/api/auth/jwt/refresh/` | Refresh JWT token |
| `POST` | `/api/auth/jwt/verify/` | Verify JWT token |

### Scans

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/scans/` | List all scans |
| `POST` | `/api/scans/` | Create a new scan |
| `GET` | `/api/scans/{id}/` | Get scan details |
| `GET` | `/api/scans/{id}/results/` | Get scan results |
| `GET` | `/api/scans/?status=pending&target=8.8.8.8` | Filter scans |

### Reports

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reports/` | List all reports |
| `GET` | `/api/reports/{id}/` | Get report details |
| `GET` | `/api/reports/{id}/download/?format=pdf` | Download report (pdf/html/json) |
| `POST` | `/api/reports/generate/` | Generate new report from scan |

---

## Scan Services

### Port Scanner (services/scanner.py)

- Socket-based TCP port scanning — fast and reliable
- Common port detection — 21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 993, 995, 3306, 3389, 5432, 5900, 8080, 8443
- OS detection via TTL heuristics
- Service identification via banner grabbing

### Vulnerability Detector (services/vulnerability_detector.py)

- High-risk port detection
- Database exposure checking
- Email service detection
- Web service vulnerability scanning
- Security weakness identification

---

## Docker Deployment

Run the entire application stack with Docker Compose:

```bash
docker-compose up
```

This will start:
- Django Backend on port 8000
- React Frontend on port 3000
- PostgreSQL database
- Redis cache & message broker
- Celery Worker for async tasks
- Celery Beat for scheduled tasks

---

## Testing the Application

### Test Credentials

| Username | Password |
|---|---|
| nikhilrajput | nikhil123 |
| testuser | test123 |

Or register new users via `POST /api/auth/register/`.

### Quick API Test (cURL)

```bash
curl -k -X POST https://localhost:8443/auth/jwt/create/ \
  -H "Content-Type: application/json" \
  -d '{"username":"nikhilrajput","password":"nikhil123"}'
```

Note: Disable SSL verification for localhost self-signed certificates.

---

## Troubleshooting

### Database Connection Issues
- Ensure Supabase credentials are correct in .env
- Verify USE_SQLITE=False is set
- Check Supabase project is active (not paused)
- Test connection: `psql -h aws-1-ap-northeast-1.pooler.supabase.com -U postgres.<project-id> -d postgres -p 5432`

### Authentication Issues
- Verify SUPABASE_URL and API keys in .env
- Check that Supabase Auth is enabled
- Ensure Row Level Security (RLS) policies are configured

### Port Already in Use
```bash
taskkill /F /IM python.exe
```

### Frontend Not Loading
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### HTTPS Certificate Warning (Self-Signed Cert)

This project uses a self-signed certificate for HTTPS development. Browsers will show:

> "Your connection is not private" / "ERR_CERT_AUTHORITY_INVALID"

This is safe for development. To proceed:
- On Desktop: Click Advanced -> Proceed to localhost (unsafe)
- On Mobile: Tap Advanced -> Proceed to website (unsafe)

To avoid permanently (optional): Use mkcert to generate a trusted CA certificate.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## Security Notice

This tool is intended for authorized security testing only. Users are responsible for ensuring they have explicit permission to scan target systems. Unauthorized scanning may violate local laws and regulations.

---

## License

MIT License

---

## Author

Developed by Nikhil Rajput

---

> Note: This project uses Supabase PostgreSQL as the primary database. SQLite support has been removed in favor of cloud database storage.

## Usage

```bash
python3 main.py
```
