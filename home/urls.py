from . import views
from django.urls import path

urlpatterns = [
    path("", views.HomeView.as_view(), name='home_url'),
    path("aboutus/", views.AboutUsView.as_view(), name='about_us_url'),
    path("help/", views.HelpView.as_view(), name='help_url'),
    path("faq/", views.FAQView.as_view(), name='faq_url'),
]
