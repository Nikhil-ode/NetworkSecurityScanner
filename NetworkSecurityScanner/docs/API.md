# API Documentation

## Authentication

### Login

**POST** `/api/auth/users/`

Request body:

```json
{
  "username": "string",
  "password": "string"
}
```

Response:

```json
{
  "token": "string",
  "user": {
    "id": "number",
    "username": "string",
    "email": "string"
  }
}
```

## Scans

### List Scans

**GET** `/api/scans/`

Response:

```json
[
  {
    "id": "number",
    "target_ip": "string",
    "target_domain": "string",
    "status": "pending|in_progress|completed|failed",
    "scan_type": "string",
    "started_at": "datetime",
    "completed_at": "datetime",
    "created_at": "datetime"
  }
]
```

### Create Scan

**POST** `/api/scans/`

Request body:

```json
{
  "target_ip": "string",
  "target_domain": "string",
  "scan_type": "string"
}
```

### Get Scan Results

**GET** `/api/scans/{scan_id}/results/`

Response:

```json
{
  "id": "number",
  "scan": "number",
  "open_ports": ["number"],
  "services": ["string"],
  "vulnerabilities_found": "number",
  "scan_data": "object"
}
```

## Reports

## List Reports

**GET** `/api/reports/`

## Get Report Details

**GET** `/api/reports/{report_id}/`

## Download Report

**GET** `/api/reports/{report_id}/download/`

## Vulnerabilities

### List Vulnerabilities

**GET** `/api/vulnerabilities/`

### Filter by Severity

**GET** `/api/vulnerabilities/by_severity/?severity=critical|high|medium|low|info`
Response:

```json
[
  {
    "id": "number",
    "scan": "number",
    "title": "string",
    "description": "string",
    "severity": "string",
    "cve_id": "string",
    "affected_service": "string",
    "port": "number",
    "remediation": "string"
  }
]
```
