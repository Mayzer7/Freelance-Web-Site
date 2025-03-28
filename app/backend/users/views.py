from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    
    if not username or not password or not email:
        return Response({'error': 'Пожалуйста, заполните все поля'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Имя пользователя уже занято'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(username=username, password=password, email=email)
    token = Token.objects.create(user=user)
    
    return Response({
        'user': {
            'username': user.username,
            'email': user.email
        },
        'token': token.key,
        'message': 'Пользователь успешно зарегистрирован!'
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Пожалуйста, укажите имя пользователя и пароль'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if not user:
        return Response({'error': 'Неверные учетные данные'}, status=status.HTTP_401_UNAUTHORIZED)
    
    login(request, user)
    token = Token.objects.get(user=user)
    
    return Response({
        'user': {
            'username': user.username,
            'email': user.email
        },
        'token': token.key,
        'message': 'Успешный вход в систему!'
    })


from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login, logout
from .serializers import UserSerializer, ProfileSerializer
from django.views.decorators.csrf import ensure_csrf_cookie
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'message': 'Successfully logged out'})

@api_view(['GET'])
def check_auth(request):
    if request.user.is_authenticated:
        return Response({'authenticated': True})
    return Response(
        {'authenticated': False}, 
        status=status.HTTP_401_UNAUTHORIZED
    )

@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile(request):
    if request.method == 'GET':
        serializer = ProfileSerializer(request.user.profile)
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        # Обработка данных формы
        data = request.data.copy()
        
        # Подготовка данных пользователя
        user_data = {}
        full_name = data.pop('fullName', '').split(maxsplit=1)
        if len(full_name) > 0:
            user_data['first_name'] = full_name[0]
        if len(full_name) > 1:
            user_data['last_name'] = full_name[1]

        # Обработка skills из JSON строки
        if 'skills' in data and isinstance(data['skills'], str):
            import json
            try:
                data['skills'] = json.loads(data['skills'])
            except json.JSONDecodeError:
                data['skills'] = []

        serializer = ProfileSerializer(
            request.user.profile,
            data=data,
            partial=request.method == 'PATCH',
            context={'user_data': user_data}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )