from django.contrib.auth import login, logout
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .forms import UserRegistrationForm
from .models import Profile
from .serializers import ProfileSerializer
from django.middleware.csrf import get_token
from django.http import JsonResponse

@api_view(['POST'])
def register_user(request):
    form = UserRegistrationForm(request.data)
    if form.is_valid():
        user = form.save()
        Profile.objects.create(user=user)  # Create empty profile
        login(request, user)
        response = Response({
            "message": "Registration successful",
            "username": user.username,
            "userId": user.id,
            "csrfToken": get_token(request)
        }, status=status.HTTP_201_CREATED)
        return response
    return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_detail(request):
    try:
        profile = Profile.objects.get(user=request.user)
    except Profile.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    logout(request)  
    response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
    response.delete_cookie('sessionid')  # Удаляем куки сессии
    return response

def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})