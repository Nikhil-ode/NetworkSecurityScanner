"""WebSocket routing for the scans app."""
from django.urls import re_path

from .consumers import ScanConsumer

websocket_urlpatterns = [
    re_path(r"^ws/scans/(?P<scan_id>[^/]+)/$", ScanConsumer.as_asgi()),
]
