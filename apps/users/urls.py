from django.urls import path
from . import views
from . import views_me

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('users/me/', views_me.me_view, name='me'),
]
