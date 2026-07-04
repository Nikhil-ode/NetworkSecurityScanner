"""
HTTPS launcher for Django backend running on Daphne with SSL.
Usage: python run_https.py
"""
import os
import sys
import ssl
import logging

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.core.asgi import get_asgi_application
import subprocess

application = get_asgi_application()

print("=" * 60)
print("🔒 HTTPS Server starting on https://0.0.0.0:8443")
print("   Mobile URL: https://10.179.253.123:8443")
print("   Local URL:  https://localhost:8443")
print("=" * 60)

result = subprocess.run(
    [
        sys.executable,
        '-m', 'daphne',
        '-b', '0.0.0.0',
        '-p', '8443',
        'config.asgi:application',
    ],
    env={**os.environ, 'DAPHNESSL_CERT': os.path.abspath('cert.pem'), 'DAPHNESSL_KEY': os.path.abspath('cert.key')},
)
if result.returncode != 0:
    sys.exit(result.returncode)
