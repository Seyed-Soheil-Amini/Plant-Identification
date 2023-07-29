from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from detail import views

urlpatterns = [
    path('explore/',views.random_plants),
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
    path('habitat/', views.PlantHabitatImageList.as_view()),
    path('habitat/<int:pk>/', views.PlantMedicinalDetail.as_view()),
    path('fruit/', views.PlantFruitImageList.as_view()),
    path('fruit/<int:pk>/', views.PlantFruitImageDetail.as_view()),
    path('delete/', views.delete_plants),
    path('delete/options/', views.delete_plants_data),
    path('checkvideo/',views.check_valid_video),
]

urlpatterns = format_suffix_patterns(urlpatterns)
