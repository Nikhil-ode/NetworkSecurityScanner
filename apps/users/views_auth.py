import jwt
import os
import requests
import time
import logging

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import JSONParser

logger = logging.getLogger(__name__)

SUPABASE_URL = os.environ.get('SUPABASE_URL', '')
SUPABASE_JWKS_URL = SUPABASE_URL.rstrip('/') + '/auth/v1/.well-known/jwks.json' if SUPABASE_URL else ''
_jwks_cache = {'keys': None, 'fetch_at': 0}

def _get_jwks():
    now = time.time()
    if _jwks_cache['keys'] is not None and now - _jwks_cache['fetch_at'] < 3600:
        return _jwks_cache['keys']
    try:
        resp = requests.get(SUPABASE_JWKS_URL, timeout=10)
        if resp.status_code == 200:
            _jwks_cache['keys'] = resp.json().get('keys', [])
            _jwks_cache['fetch_at'] = now
            return _jwks_cache['keys']
    except Exception as e:
        logger.warning(f'Failed to fetch Supabase JWKS: {e}')
    return _jwks_cache['keys'] or []

def _verify_supabase_jwt(token):
    if not SUPABASE_URL:
        return None
    try:
        header = jwt.get_unverified_header(token)
        kid = header.get('kid')
        keys = _get_jwks()
        key = next((k for k in keys if k.get('kid') == kid), None)
        if not key:
            return None
        from jwt.algorithms import PyJWK
        public_key = PyJWK(key).key
        payload = jwt.decode(
            token,
            public_key,
            algorithms=[header.get('alg', 'ES256')],
            audience='authenticated',
            options={'verify_aud': True},
        )
        return payload
    except Exception as e:
        logger.warning(f'Supabase JWT verification failed: {e}')
        return None


@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def csrf_cookie(request):
    get_token(request)
    return Response({'detail': 'CSRF cookie set'})


@api_view(['POST'])
@csrf_protect
@permission_classes([AllowAny])
@parser_classes([JSONParser])
def session_login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        logger.warning('Login failed: username or password not provided.')
        return Response({
            'error': 'Username and password are required',
        }, status=400)

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        request.session.save()
        logger.info("User '%s' logged in successfully." % username)
        return Response({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
        }, status=200)
    else:
        logger.warning("Failed login attempt for username: '%s'" % username)
        return Response({'error': 'Invalid credentials or user is inactive.'}, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([JSONParser])
def supabase_login_view(request):
    access_token = request.data.get('access_token')
    if not access_token:
        return Response({'error': 'access_token is required'}, status=400)

    payload = _verify_supabase_jwt(access_token)
    if payload is None:
        return Response({'error': 'Invalid or expired Supabase token'}, status=401)

    supabase_uid = payload.get('sub')
    email = payload.get('email', '')
    user_metadata = payload.get('user_metadata', {}) or {}
    username = user_metadata.get('user_name') or user_metadata.get('preferred_username') or (email.split('@')[0] if email else supabase_uid[:8])
    if not username:
        username = supabase_uid[:8]

    if not supabase_uid:
        return Response({'error': 'Supabase token missing user id'}, status=401)

    user = None
    if email and User.objects.filter(email=email).exists():
        user = User.objects.filter(email=email).first()
    if user is None and User.objects.filter(username=username).exists():
        user = User.objects.filter(username=username).first()
    if user is None:
        username = username[:30]
        base = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = '%s%d' % (base[:20], counter)
            counter += 1
        user = User.objects.create_user(username=username, email=email)
        logger.info("Created Django user '%s' from Supabase uid %s" % (username, supabase_uid))

    login(request, user)
    request.session.save()
    logger.info("Supabase login successful for user '%s'" % user.username)
    return Response({
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
        },
        'supabase_uid': supabase_uid,
    }, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def session_logout_view(request):
    logout(request)
    return Response({'message': 'Logout successful'}, status=200)