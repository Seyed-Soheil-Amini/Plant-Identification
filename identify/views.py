from django.views.generic import TemplateView
from django.shortcuts import render, redirect
from detail.models import Plant


class IdentifyView(TemplateView):
    template_name = 'IdentifyPage/index.html'


# class ResultWithDetail(TemplateView):
#     template_name = 'IdentifyPage/Result/Result.html'

def ResultWithDetail(request, pk):
    context = {'plant_obj': Plant.objects.get(pk=pk)}
    return render(request, 'IdentifyPage/Result/Result.html', context=context)
