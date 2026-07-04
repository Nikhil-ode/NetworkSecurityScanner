# Deployment Guide

## Prerequisites

- Docker and Docker Compose
- Server with adequate resources
- Domain name (for production)
- SSL certificate (for production)

## Deployment Checklist

## Backend

- [ ] Update `SECRET_KEY` in settings.py
- [ ] Set `DEBUG=False`
- [ ] Configure allowed hosts
- [ ] Set up PostgreSQL database
- [ ] Configure Redis for Celery
- [ ] Set up static files serving
- [ ] Configure CORS settings
- [ ] Set up logging

## Frontend

- [ ] Build production bundle
- [ ] Configure API base URL
- [ ] Set environment variables
- [ ] Test all features
- [ ] Configure CDN if needed

## Docker Deployment

## Using Docker Compose

1. **Create production environment file:**

```bash
cp .env.example .env
# Update with production settings
```

1. **Build and start services:**

```bash
docker-compose up -d
```

1. **Run migrations:**

```bash
docker-compose exec backend python manage.py migrate
```

1. **Create superuser:**

```bash
docker-compose exec backend python manage.py createsuperuser
```

## Kubernetes Deployment

Create deployment manifests for Kubernetes:

```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: scanner-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: scanner-backend
  template:
    metadata:
      labels:
        app: scanner-backend
    spec:
      containers:
      - name: backend
        image: scanner-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: DEBUG
          value: "false"
        # Add other environment variables
```

## Health Checks

Monitor the application with health checks:

```bash
curl http://localhost:8000/api/auth/users/me/
curl http://localhost:3000
```

## Logging and Monitoring

- Configure logging in Django settings
- Set up application monitoring (e.g., New Relic, DataDog)
- Monitor database performance
- Set up alerts for errors and anomalies

## Backup Strategy

- Daily database backups
- Keep backups in separate location
- Test recovery procedures
- Document backup and restore processes
