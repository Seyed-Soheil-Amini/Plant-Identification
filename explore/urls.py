from django.urls import path
from . import views

urlpatterns = [
    path('',views.ExploreView.as_view(), name='explore_url')
]