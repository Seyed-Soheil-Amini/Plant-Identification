from django.shortcuts import render
from django.views.generic import TemplateView


class HomeView(TemplateView):
    template_name = 'index.html'


class ExplorView(TemplateView):
    template_name = 'ExplorePage/index.html'
