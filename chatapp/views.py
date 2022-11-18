from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render

from django.views import View

from chatapp.forms import CreateChatForm
from chatapp.models import Chat, Message


class ChooseChatView(View):
    title = 'Выберите/создайте чат'
    template_name = 'chatapp/choose_chat.html'

    @staticmethod
    def is_ajax(request):
        return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'

    def get(self, request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('auth/login')
        if self.is_ajax(request=request):
            Chat.objects.create(chat_name=request.GET.dict()['chat_name'])
            chats = Chat.objects.all()
            content = ''
            item = chats.last()
            content += '<a class="chat-link" href="/chat/' + str(item.id) + '/">' \
                            '<div class="chat-button">' \
                                '<div class="chat-button-text">' \
                                    '' + str(item.chat_name) + '' \
                                '</div>' \
                                '<div class="chat-button-arrow">' \
                                    '<img src="../static/img/Layer 2.svg" alt=""/>' \
                                '</div>' \
                             '</div>' \
                         '</a>'
            response = {
                'content': content
            }
            return JsonResponse(response)
        return render(request, self.template_name, {
                                                        'title': self.title,
                                                        'form': CreateChatForm,
                                                        'chats': Chat.objects.all()
                                                    })


class ChatView(View):
    template_name = 'chatapp/chat.html'

    def get(self, request, pk):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('auth/login')
        chat = Chat.objects.filter(id=pk).first()
        context = {
            'title': chat.chat_name,
            'user_name': request.user.username,
            'messages': Message.objects.filter(chat_id=pk)
        }
        return render(request, self.template_name, context)
