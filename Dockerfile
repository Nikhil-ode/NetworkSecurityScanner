FROM python:3.12-slim AS backend

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Generate SSL cert
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout cert.key -out cert.pem \
    -subj "/C=IN/CN=localhost"

# Build frontend
FROM node:20-alpine AS frontend
WORKDIR /app
COPY NetworkSecurityScanner/frontend/package.json ./
RUN npm install
COPY NetworkSecurityScanner/frontend/ .
RUN npm run build

# Final image: nginx serving frontend + proxy to backend
FROM nginx:alpine

# Copy frontend build
COPY --from=frontend /app/build /usr/share/nginx/html

# Copy backend
COPY --from=backend /app /app

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start backend + nginx
CMD python -m daphne -e tcp:8000 config.asgi:application & nginx -g "daemon off;"