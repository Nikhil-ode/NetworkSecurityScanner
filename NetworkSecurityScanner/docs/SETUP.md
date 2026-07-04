# Setup Guide

## Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL or SQLite (included with Django)
- Redis (optional, for Celery)

## Backend Setup

1. **Create virtual environment:**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

1. **Install dependencies:**

```bash
pip install -r requirements.txt
```

1. **Configure environment variables:**
Copy `.env.example` to `.env` and update with your settings:

```bash

cp .env.example .env
```

1. **Run migrations:**

```bash
python manage.py migrate
```

1. **Create superuser:**

```bash
python manage.py createsuperuser
```

1. **Run development server:**

```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

## Frontend Setup

1. **Install dependencies:**

```bash
cd frontend
npm install
```

1. **Configure environment variables:**
Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

1. **Start development server:**

```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## Docker Setup (Optional)

You can use Docker Compose to run the entire application:

```bash
docker-compose up
```

This will start:

- Django backend on port 8000
- React frontend on port 3000
- PostgreSQL database
- Redis (for Celery)
