from django.db import models


# Create your models here.


class Chat(models.Model):
    chat_name = models.CharField(max_length=16)


class Message(models.Model):
    msg_id = models.CharField(max_length=16)
    date_client = models.CharField(max_length=16)
    time_client = models.CharField(max_length=16)
    from_user = models.CharField(max_length=16)
    text = models.TextField()
    chat_id = models.IntegerField()
    is_read = models.BooleanField(default=False)
