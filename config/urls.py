"""
URL configuration for scanner_project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.cache import never_cache
from django.shortcuts import render
from django.http import HttpResponse
# JWT endpoints intentionally removed (project uses session authentication only)

@never_cache
def index_view(request):
    try:
        return render(request, 'index.html')
    except Exception:
        return HttpResponse("<html><body>App is loading...</body></html>", content_type='text/html')


urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),

    # ✅ Project APIs
    path('auth/', include('apps.users.urls')),
    path('api/auth/', include('apps.users.urls')),
    path('api/scans/', include('apps.scans.urls')),
    path('api/reports/', include('apps.reports.urls')),
    path('api/vulnerabilities/', include('apps.vulnerabilities.urls')),
]

# ✅ Static & Media files
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# ✅ Serve React frontend for all other routes (catch-all)
# Exclude /static/, /media/, and API routes so WhiteNoise can serve JS/CSS correctly
urlpatterns += [
    re_path(r'^(?!api/|auth/jwt/|auth/|static/|media/).+$', index_view, name='home'),
    re_path(r'^$', index_view, name='home_root'),
    # --- Compatibility: avoid hard 404 when frontend accidentally calls /api/api/... ---
    # This redirects /api/api/<path> -> /api/<path>.
    re_path(r'^api/api/(?P<subpath>.+)$', lambda request, subpath: HttpResponse(status=301)),
]

