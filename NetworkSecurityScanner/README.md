# Network Security Scanner

A comprehensive network security scanner application with Django backend and React frontend for vulnerability detection and network analysis.

## Features

- **Port Scanning**: Identify open ports and services on target systems
- **Service Detection**: Detect running services and their versions
- **Vulnerability Scanning**: Identify known vulnerabilities and security weaknesses
- **Real-time Monitoring**: Track scan progress and view results in real-time
- **Report Generation**: Generate comprehensive security reports in PDF, HTML, and JSON formats
- **User Management**: Multi-user support with role-based access control
- **Database Integration**: Supabase integration for cloud data storage

## Technology Stack

### Backend

- **Django**: Web framework for Python
- **Django REST Framework**: API development
- **Celery**: Asynchronous task processing
- **PostgreSQL/SQLite**: Database
- **Redis**: Message broker and caching

### Frontend

- **React**: JavaScript library for building user interfaces
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: CSS framework
- **Supabase**: Backend as a Service

## Project Structure

```plaintext
NetworkSecurityScanner/
├── backend/              # Django application
├── frontend/             # React application
├── docs/                 # Documentation
└── docker-compose.yml    # Docker configuration
```

## Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm start
```

## Documentation

- [API Documentation](docs/API.md) - REST API endpoints and usage
- [Setup Guide](docs/SETUP.md) - Detailed setup instructions
- [Database Guide](docs/DATABASE.md) - Database configuration and models
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions

## API Endpoints

### Authentication

- `POST /api/auth/users/` - Login
- `GET /api/auth/users/me/` - Get current user

### Scans

- `GET /api/scans/` - List scans
- `POST /api/scans/` - Create new scan
- `GET /api/scans/{id}/` - Get scan details
- `GET /api/scans/{id}/results/` - Get scan results

### Reports

- `GET /api/reports/` - List reports
- `POST /api/reports/` - Generate new report
- `GET /api/reports/{id}/download/` - Download report

### Vulnerabilities

- `GET /api/vulnerabilities/` - List vulnerabilities
- `GET /api/vulnerabilities/by_severity/` - Filter by severity

## Configuration

### Environment Variables

#### Backend (.env)

```env
SECRET_KEY=your-secret-key
DEBUG=False
DATABASE_URL=postgresql://user:password@localhost/dbname
CELERY_BROKER_URL=redis://localhost:6379/0
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key
```

#### Frontend (.env.local)

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key
```

## Docker Deployment

Run the entire application using Docker Compose:

```bash
docker-compose up
```

This will start:

- Django backend on port 8000
- React frontend on port 3000
- PostgreSQL database
- Redis cache

## Development

### Running Tests

Backend:

```bash
cd backend
python manage.py test
```

Frontend:

```bash
cd frontend
npm test
```

### Code Style

- Backend: Follow PEP 8 style guide
- Frontend: Use ESLint and Prettier

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email <support@networksecurityscanner.com> or open an issue on GitHub.

## Roadmap

- [ ] Add advanced network mapping
- [ ] Implement automated remediation suggestions
- [ ] Add integration with third-party security tools
- [ ] Develop mobile application
- [ ] Implement machine learning for anomaly detection
