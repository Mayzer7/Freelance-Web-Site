from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Profile, Skill

User = get_user_model()

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ('id', 'name')

class ProfileSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    skill_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Profile
        fields = (
            'id', 'bio', 'skills', 'skill_ids', 'experience_level',
            'hourly_rate', 'portfolio_url', 'github_url', 'linkedin_url',
            'rating', 'completed_projects', 'specialization', 'languages',
            'available_for_hire', 'created_at', 'updated_at'
        )
        read_only_fields = ('rating', 'completed_projects', 'created_at', 'updated_at')

    def update(self, instance, validated_data):
        skill_ids = validated_data.pop('skill_ids', None)
        if skill_ids is not None:
            instance.skills.set(Skill.objects.filter(id__in=skill_ids))
        return super().update(instance, validated_data)

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    avatar = serializers.SerializerMethodField()  # Меняем тип поля

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'balance', 'avatar', 'profile')
        read_only_fields = ('id', 'balance')

    def get_avatar(self, obj):
        """Формирует полный URL для аватара"""
        request = self.context.get('request')
        if obj.avatar:
            return request.build_absolute_uri(obj.avatar.url)
        return None  # Если нет аватара

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Пароли не совпадают"})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(user=user)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)