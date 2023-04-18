from django.shortcuts import render
from django.views.generic import TemplateView


class medicinal_properties_view(TemplateView):
    template_name = 'MedicinalPage/index.html'
