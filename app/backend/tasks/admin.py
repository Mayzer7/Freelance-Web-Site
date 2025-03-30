from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'budget', 'deadline', 'created_at')
    list_filter = ('created_at', 'deadline')
    search_fields = ('title', 'description', 'author__username')
    date_hierarchy = 'created_at'