from django.db import models


# Create your models here.


class Chat(models.Model):
    chat_name = models.CharField(max_length=16)


class Message(models.Model):
    date_client = models.CharField(max_length=16)
    time_client = models.CharField(max_length=16)
    from_user = models.CharField(max_length=16)
    text = models.TextField()
    chat_id = models.IntegerField()
    is_read = models.BooleanField(default=False)
