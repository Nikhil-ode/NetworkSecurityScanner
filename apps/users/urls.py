from django.urls import path
from . import views
from . import views_me
from . import views_auth

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('users/me/', views_me.me_view, name='me'),
    path('csrf/', views_auth.csrf_cookie, name='csrf_cookie'),
    path('session-login/', views_auth.session_login_view, name='session_login'),
    path('session-logout/', views_auth.session_logout_view, name='session_logout'),
]