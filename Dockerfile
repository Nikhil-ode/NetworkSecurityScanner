FROM python:3.12-slim

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    openssl \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Build and copy frontend
RUN mkdir -p /app/static && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    cd NetworkSecurityScanner/frontend && \
    npm install && \
    npm run build && \
    cp -r build/* /app/static/

# Generate SSL cert
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout cert.key -out cert.pem \
    -subj "/C=IN/CN=localhost"

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start daphne in background, then nginx in foreground
CMD sh -c "python -m daphne -e tcp:8000:interface=0.0.0.0 config.asgi:application & nginx -g 'daemon off;'"
