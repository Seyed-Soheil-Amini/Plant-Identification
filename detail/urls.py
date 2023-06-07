from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from detail import views
from detail.views import *

urlpatterns = [
    path('data/', views.PlantList.as_view()),
    path('<int:pk>/', views.PlantDetail.as_view()),
    path('leaf/', views.PlantLeafImageList.as_view()),
    path('stem/', views.PlantStemImageList.as_view()),
    path('flower/', views.PlantFlowerImageList.as_view()),
    path('leaf/<int:pk>/', views.PlantLeafImageDetail.as_view()),
    path('stem/<int:pk>/', views.PlantStemImageDetail.as_view()),
    path('flower/<int:pk>/', views.PlantFlowerImageDetail.as_view()),
    path('medicine/', views.PlantMedicinalList.as_view()),
    path('medicine/<int:pk>/', views.PlantMedicinalDetail.as_view()),

]

urlpatterns = format_suffix_patterns(urlpatterns)
