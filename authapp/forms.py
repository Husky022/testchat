from django.contrib.auth.forms import AuthenticationForm
from django.forms import TextInput, EmailInput, CharField

from authapp.models import BlurChatUser


class LoginForm(AuthenticationForm):
    username = CharField(widget=TextInput(attrs={'placeholder': 'Логин', 'class': 'form-auth-field'}))
    password = CharField(widget=TextInput(attrs={'placeholder': 'Пароль', 'class': 'form-auth-field'}))


