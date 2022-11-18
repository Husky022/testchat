from django.db import models


# Create your models here.

class BlurChatUser(models.Model):
    username = models.CharField(max_length=32)
    password = models.TextField()
    chat = models.ManyToManyField('chatapp.Chat')
