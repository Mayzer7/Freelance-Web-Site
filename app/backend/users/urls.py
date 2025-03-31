from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('profile/', views.profile_view, name='profile'),
    path('skills/', views.get_skills, name='skills'),
    path('upload-avatar/', views.UploadAvatarView.as_view(), name='upload-avatar'),
]