from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.get_user_info, name='get_user_info'),
    path('register/', views.register_user, name='register'),
    path("login/", views.login_user, name="login"),
    path("logout/", views.logout_user, name="logout"),
]