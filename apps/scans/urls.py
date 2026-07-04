"""Scans app URLs"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ScanViewSet, ScanResultViewSet

router = DefaultRouter()
router.register(r'', ScanViewSet, basename='scan')
router.register(r'results', ScanResultViewSet, basename='scan-result')

urlpatterns = [
    path('', include(router.urls)),
]
