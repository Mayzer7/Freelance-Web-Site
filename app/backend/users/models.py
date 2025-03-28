from django.db import models
from django.contrib.auth.models import User

from django.contrib.auth.models import AbstractUser
from django.db import models

from django.dispatch import receiver
from django.core.validators import MinValueValidator
from django.db.models.signals import post_save

class User(AbstractUser):
    email = models.EmailField(unique=True)
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return self.username


class Profile(models.Model):
    EXPERIENCE_CHOICES = [
        ('beginner', 'Начинающий'),
        ('intermediate', 'Средний уровень'),
        ('expert', 'Эксперт'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    specialization = models.CharField(max_length=100, blank=True)
    hourly_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        null=True,
        blank=True
    )
    description = models.TextField(blank=True)
    skills = models.JSONField(default=list, blank=True)
    experience_level = models.CharField(
        max_length=20,
        choices=EXPERIENCE_CHOICES,
        default='beginner'
    )
    portfolio_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    languages = models.JSONField(default=list, blank=True)
    education = models.JSONField(default=list, blank=True)
    certificates = models.JSONField(default=list, blank=True)
    location = models.CharField(max_length=100, blank=True)
    available_for_hire = models.BooleanField(default=True)
    preferred_work_hours = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_profiles'
        verbose_name = 'Profile'
        verbose_name_plural = 'Profiles'

    def __str__(self):
        return f"Profile of {self.user.username}"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()