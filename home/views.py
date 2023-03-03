from django.views.generic import TemplateView


class HomeView(TemplateView):
    template_name = 'index.html'


class AboutUsView(TemplateView):
    template_name = 'AboutPage/index.html'


class HelpView(TemplateView):
    template_name = 'HelpPage/index.html'


class FAQView(TemplateView):
    template_name = 'FAQPage/index.html'
