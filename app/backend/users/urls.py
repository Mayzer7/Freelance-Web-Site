from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('profile/', views.profile_detail, name='profile'),
    path('logout/', views.logout_user, name='logout'),
    path('csrf/', views.get_csrf_token, name='get_csrf_token'),
]