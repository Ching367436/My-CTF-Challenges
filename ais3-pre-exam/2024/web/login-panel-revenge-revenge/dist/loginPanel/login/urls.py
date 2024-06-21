from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login, name='login'),
    path('2fa/', views._2fa, name='2fa'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('image/', views.image, name='image'),
    path('logout/', views.logout, name='logout')
]