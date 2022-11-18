import django
from django.forms import TextInput, EmailInput, CharField


# from authapp.models import BlurChatUser


class CreateChatForm(django.forms.Form):
    chat_name = CharField(widget=TextInput(attrs={'placeholder': 'Введите имя чата', 'class': 'form-create-field'}))
