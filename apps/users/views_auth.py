from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.middleware.csrf import get_token
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

# CSRF cookie endpoint
@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_cookie(request):
    token = get_token(request)
    response = Response({"detail": "CSRF cookie set"})
    response.set_cookie('csrftoken', token, httponly=False)
    return response

# Session-based login
@csrf_protect
@api_view(['POST'])
@permission_classes([AllowAny])
def session_login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        return Response({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            }
        }, status=200)
    return Response({"error": "Invalid credentials"}, status=400)

# Session-based logout
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def session_logout_view(request):
    logout(request)
    return Response({"message": "Logout successful"}, status=200)