from django.contrib import auth
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from django.urls import reverse_lazy, reverse
from django.views import View

from django.views.generic import FormView
from authapp.forms import LoginForm


# Create your views here.

class LoginView(FormView):
    title = 'Авторизация'
    template_name = 'authapp/login.html'
    form_class = LoginForm

    def form_valid(self, form):
        username = self.request.POST['username']
        password = self.request.POST['password']
        user = auth.authenticate(username=username, password=password)
        auth.login(self.request, user)
        return redirect('main:choose_chat')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = self.title
        return context

    def get_success_url(self):
        return reverse_lazy('main')


class LogoutView(View):
    redirect_page = 'auth:login'

    def get(self, request):
        auth.logout(request)
        return HttpResponseRedirect(reverse(self.redirect_page))
