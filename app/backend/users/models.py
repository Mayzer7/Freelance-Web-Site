from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=1000, blank=True)
    avatar = models.URLField(max_length=500, blank=True)
    title = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=100, blank=True)
    
    # Social links
    github = models.URLField(max_length=200, blank=True)
    linkedin = models.URLField(max_length=200, blank=True)
    twitter = models.URLField(max_length=200, blank=True)
    website = models.URLField(max_length=200, blank=True)
    
    # Professional info
    skills = models.JSONField(default=list, blank=True)
    experience = models.TextField(blank=True)
    education = models.TextField(blank=True)
    
    # Portfolio
    portfolio_items = models.JSONField(default=list, blank=True)
    
    # Rates and availability
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    available_for_hire = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username