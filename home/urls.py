from . import views
from django.urls import path

urlpatterns = [
    path("", views.ExplorView.as_view(), name='home'),

]
