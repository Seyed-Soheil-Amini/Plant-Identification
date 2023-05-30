from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from detail import views
from detail.views import *

urlpatterns = [
    path('data/', views.PlantList.as_view()),
    path('<int:pk>/', views.PlantDetail.as_view()),
    # path("randomplant/", randomPlant),
    # path("explore/", explorePlantList)
]

urlpatterns = format_suffix_patterns(urlpatterns)
