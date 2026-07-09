"""
URL configuration for scanner_project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from django.shortcuts import render
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

@never_cache
def index_view(request):
    return render(request, 'index.html')


urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),

    # ✅ JWT Auth Endpoints
    path('auth/jwt/create/', TokenObtainPairView.as_view(), name='jwt_create'),
    path('auth/jwt/refresh/', TokenRefreshView.as_view(), name='jwt_refresh'),
    path('auth/jwt/verify/', TokenVerifyView.as_view(), name='jwt_verify'),

    # ✅ Project APIs
    path('auth/', include('apps.users.urls')),
    path('api/auth/', include('apps.users.urls')),
    path('api/scans/', include('apps.scans.urls')),
    path('api/reports/', include('apps.reports.urls')),
    path('api/vulnerabilities/', include('apps.vulnerabilities.urls')),
]

# ✅ Static & Media files
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# ✅ Serve React frontend for all other routes (catch-all)
# Exclude /static/, /media/, and API routes so WhiteNoise can serve JS/CSS correctly
urlpatterns += [
    re_path(r'^(?!api/|auth/jwt/|auth/|static/|media/).+$', index_view, name='home'),
    re_path(r'^$', index_view, name='home_root'),
]
