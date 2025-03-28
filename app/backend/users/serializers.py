from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

from .models import Profile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Пароли не совпадают"})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user
    
    
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    fullName = serializers.SerializerMethodField()
    hourlyRate = serializers.DecimalField(
        source='hourly_rate',
        max_digits=10,
        decimal_places=2,
        required=False
    )

    class Meta:
        model = Profile
        fields = [
            'user', 'fullName', 'avatar', 'specialization', 'hourlyRate',
            'description', 'skills', 'experience_level', 'portfolio_url',
            'github_url', 'linkedin_url', 'languages', 'education',
            'certificates', 'location', 'available_for_hire',
            'preferred_work_hours', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_fullName(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username

    def update(self, instance, validated_data):
        # Обновление данных пользователя
        user_data = self.context.get('user_data', {})
        if user_data:
            user = instance.user
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            user.save()

        # Обновление данных профиля
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance