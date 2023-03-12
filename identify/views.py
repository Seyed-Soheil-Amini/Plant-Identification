from django.views.generic import TemplateView
from django.shortcuts import redirect, render


class IdentifyView(TemplateView):
    template_name = 'IdentifyPage/index.html'
class FirstResultView(TemplateView):
    template_name = 'IdentifyPage/Result/FirstResult.html'

def result(request):
    return render(request,'IdentifyPage/Result/FirstResult.html')