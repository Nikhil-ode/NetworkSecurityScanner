from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.db import IntegrityError

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    try:
        user = User.objects.create_user(username=username, password=password)

        # Session-based auth: user ko login karo (React withCredentials=true will store cookies)
        login(request, user)
        return Response({
            "message": "User registered successfully",
        }, status=201)
    except IntegrityError:
        return Response({"error": "Database error while creating user"}, status=500)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    print('LOGIN PAYLOAD:', request.data)
    print('LOGIN CONTENT_TYPE:', request.content_type)
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username and password required", "received": request.data}, status=400)

    user = authenticate(username=username, password=password)
    if user:
        login(request, user)
        return Response({
            "message": "Login successful",
        }, status=200)

    return Response(
        {"error": "Invalid credentials", "received_username": username},
        status=400
    )
