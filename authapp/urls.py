from django.urls import path

import authapp.views as authapp

app_name = 'auth'

urlpatterns = [
    path('login/', authapp.LoginView.as_view(), name='login'),
    path('logout/', authapp.LogoutView.as_view(), name='logout'),
]
