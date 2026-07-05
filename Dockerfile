FROM python:3.12-alpine

WORKDIR /app

# System deps
RUN apk add --no-cache \
    gcc \
    musl-dev \
    linux-headers \
    openssl \
    nginx \
    nodejs \
    npm \
    supervisor

# Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Build frontend
RUN mkdir -p /app/static && \
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

# Supervisor config
COPY supervisord.conf /etc/supervisord.conf

RUN mkdir -p /var/log/supervisor

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
