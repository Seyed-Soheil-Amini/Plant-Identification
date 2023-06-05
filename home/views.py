from django.shortcuts import render
from django.views.generic import TemplateView


class HomeView(TemplateView):
    template_name = 'index.html'


class AboutUsView(TemplateView):
    template_name = 'AboutPage/index.html'


class HelpView(TemplateView):
    template_name = 'HelpPage/index.html'


class FAQView(TemplateView):
    template_name = 'FAQPage/index.html'


def identify_guides(request):
    return render(request=request, template_name='HelpPage/topics/identify.html')


def explore_guides(request):
    return render(request=request, template_name='HelpPage/topics/explore.html')


def support_guides(request):
    return render(request=request, template_name='HelpPage/topics/support.html')


def blog_guides(request):
    return render(request=request, template_name='HelpPage/topics/blog.html')


def medicine_guides(request):
    return render(request=request, template_name='HelpPage/topics/midcine.html')


def growth_guides(request):
    return render(request=request, template_name='HelpPage/topics/growth.html')


def updating_error(request):
    return render(request=request, template_name='updating.html')


def implement_soon_error(request):
    return render(request=request, template_name='soon.html')
