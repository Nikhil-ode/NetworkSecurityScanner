# Database Configuration

## Models Overview

### Users App

- **User**: Django's built-in User model
- **UserProfile**: Extended user information including organization and role

### Scans App

- **Scan**: Represents a security scan job
- **ScanResult**: Contains the results of a completed scan

### Reports App

- **Report**: Generated security reports in various formats

### Vulnerabilities App

- **Vulnerability**: Individual vulnerability findings

## Database Setup

### SQLite (Default — Development)

The default configuration uses SQLite for development. The database file will be created as `db.sqlite3` in the backend directory.

### PostgreSQL (Production)

1. **Install PostgreSQL**

2. **Create database and user:**

```sql
CREATE DATABASE network_scanner;
CREATE USER scanner_user WITH PASSWORD 'password';
ALTER ROLE scanner_user SET client_encoding TO 'utf8';
ALTER ROLE scanner_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE scanner_user SET default_transaction_deferrable TO on;
ALTER ROLE scanner_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE network_scanner TO scanner_user;
```

1. **Update .env:**

```env
DATABASE_URL=postgresql://scanner_user:password@localhost:5432/network_scanner
```

1. **Install psycopg2:**

```bash
pip install psycopg2-binary
```

## Running Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

## Database Backup

To backup the database:

```bash
# SQLite
cp backend/db.sqlite3 backend/db.sqlite3.backup

# PostgreSQL
pg_dump network_scanner > backup.sql
```
