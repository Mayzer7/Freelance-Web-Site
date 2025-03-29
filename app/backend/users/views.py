from django.contrib.auth.models import AbstractUser
from django.contrib.auth import authenticate
from django.db import models
from rest_framework import serializers, views, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password

from .serializers import RegisterSerializer

from django.contrib.auth import get_user_model

User = get_user_model()



@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Требуем авторизацию по JWT
def get_user_info(request):
    user = request.user
    return Response({
        "username": user.username,
        "email": user.email,
        "balance": user.balance
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Registration successful!",
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Вы успешно вошли!",
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Неверное имя пользователя или пароль"}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    response = Response({"message": "Вы вышли из аккаунта!"}, status=status.HTTP_200_OK)
    response.delete_cookie("access")  # Удаляем access-токен (если используем cookies)
    response.delete_cookie("refresh") # Удаляем refresh-токен (если используем cookies)
    return response