from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = Task
        fields = [
            'id', 
            'title', 
            'description', 
            'budget', 
            'deadline', 
            'skills', 
            'created_at',
            'author_name'
        ]
        read_only_fields = ['created_at', 'author_name']

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)