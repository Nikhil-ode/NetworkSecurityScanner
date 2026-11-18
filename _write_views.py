import jwt
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.conf import settings

# JWT write/views endpoints for token creation and management

@api_view(['POST'])
@permission_classes([AllowAny])
def jwt_create_view(request):
    """
    Create JWT token for authenticated user.
    Expects: {username, password}
    Returns: JWT access and refresh tokens
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password required'}, 
            status=400
        )
    
    from django.contrib.auth import authenticate
    user = authenticate(username=username, password=password)
    
    if user:
        # Generate JWT token
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Login successful',
            'token': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=200)
    
    return Response(
        {'error': 'Invalid credentials'}, 
        status=400
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def jwt_refresh_view(request):
    """
    Refresh JWT access token using refresh token.
    Expects: {refresh_token}
    Returns: New access token
    """
    refresh_token = request.data.get('refresh_token')
    
    if not refresh_token:
        return Response(
            {'error': 'Refresh token required'}, 
            status=400
        )
    
    try:
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken(refresh_token)
        return Response({
            'access': str(refresh.access_token),
        }, status=200)
    except Exception as e:
        return Response(
            {'error': 'Invalid refresh token'}, 
            status=401
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def jwt_verify_view(request):
    """
    Verify JWT token validity.
    Expects: {token}
    Returns: Token payload if valid
    """
    token = request.data.get('token')
    
    if not token:
        return Response(
            {'error': 'Token required'}, 
            status=400
        )
    
    try:
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=['HS256']
        )
        return Response({
            'valid': True,
            'payload': payload,
        }, status=200)
    except jwt.ExpiredSignatureError:
        return Response(
            {'error': 'Token has expired'}, 
            status=401
        )
    except jwt.InvalidTokenError:
        return Response(
            {'error': 'Invalid token'}, 
            status=401
        )