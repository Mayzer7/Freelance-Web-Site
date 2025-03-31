import json

from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'budget', 'deadline', 'skills', 'created_at', 'author')
        read_only_fields = ('author',)

    def get_author(self, obj):
        return {
            "username": obj.author.username,
            "avatar": obj.author.avatar.url if obj.author.avatar else None
        }
