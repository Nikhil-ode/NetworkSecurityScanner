from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser



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
def session_login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({
            "error": "Username and password required",
            "received": request.data,
        }, status=400)

    try:
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
    except Exception as e:
        # Helps identify CSRF/session/cookie failures in production logs & response
        detail = str(e)
        if 'CSRF' in detail or 'csrf' in detail:
            detail = f"CSRF failed: {detail}"
        return Response({"error": "Login exception", "detail": detail}, status=403)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def session_logout_view(request):
    logout(request)
    return Response({"message": "Logout successful"}, status=200)
