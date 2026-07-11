from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_cookie(request):
    # Ensure a session exists so SessionAuthentication can recognize the user later
    request.session.modified = True
    request.session.save()

    token = get_token(request)
    response = Response({"detail": "CSRF cookie set"})
    response.set_cookie(
        'csrftoken',
        token,
        httponly=False,
        samesite='None' if not settings.DEBUG else 'Lax',
        secure=not settings.DEBUG,
    )
    return response


@api_view(['POST'])
@csrf_protect
@permission_classes([AllowAny])
@parser_classes([JSONParser])
def session_login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        logger.warning("Login failed: username or password not provided.")
        return Response({
            "error": "Username and password are required",
        }, status=400)

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        # Explicitly save the session to ensure the session cookie is sent.
        request.session.save()
        logger.info(f"User '{username}' logged in successfully.")
        return Response({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            }
        }, status=200)
    else:
        # Note: authenticate returns None for inactive users, too.
        logger.warning(f"Failed login attempt for username: '{username}'")
        return Response({"error": "Invalid credentials or user is inactive."}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def session_logout_view(request):
    logout(request)
    return Response({"message": "Logout successful"}, status=200)
