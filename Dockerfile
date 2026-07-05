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

# Configure nginx
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    
    location / {
        root /app/static;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Expose port 80
EXPOSE 80

# Start nginx + daphne
CMD service nginx start && python -m daphne -e tcp:8000:interface=0.0.0.0 config.asgi:application