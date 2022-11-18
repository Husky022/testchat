from django.urls import path

import chatapp.views as chatapp

app_name = 'main'

urlpatterns = [
    path('', chatapp.ChooseChatView.as_view(), name='choose_chat'),
    path('chat/<int:pk>/', chatapp.ChatView.as_view(), name='chat'),
    path('refresh_chats', chatapp.ChooseChatView.as_view(), name='refresh_chats'),
]
