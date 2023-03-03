from django.views.generic import TemplateView


class ExploreView(TemplateView):
    template_name = 'ExplorePage/index.html'
