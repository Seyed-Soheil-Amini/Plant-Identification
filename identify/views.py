from django.views.generic import TemplateView
from django.shortcuts import render,redirect


class IdentifyView(TemplateView):
    template_name = 'IdentifyPage/index.html'

def FirstResult(request):
    return render(request,'IdentifyPage/Result/FirstResult.html')
# def reaonfond(object):
#     random
