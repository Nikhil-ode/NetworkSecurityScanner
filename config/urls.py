"""
URL configuration for scanner_project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

# 👇 Simple homepage view
def home(request):
    return HttpResponse("Welcome to Network Security Scanner!")

urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),

    # ✅ JWT Auth Endpoints
    path('auth/jwt/create/', TokenObtainPairView.as_view(), name='jwt_create'),
    path('auth/jwt/refresh/', TokenRefreshView.as_view(), name='jwt_refresh'),
    path('auth/jwt/verify/', TokenVerifyView.as_view(), name='jwt_verify'),

    # ✅ Project APIs
    path('api/auth/', include('apps.users.urls')),
    path('api/scans/', include('apps.scans.urls')),
    path('api/reports/', include('apps.reports.urls')),
    path('api/vulnerabilities/', include('apps.vulnerabilities.urls')),

    # ✅ Root homepage
    path('', home),
]

# ✅ Static & Media files (only in DEBUG mode)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
