from django.urls import path
from . import views

urlpatterns = [
    path("", views.IdentifyView.as_view(), name='identify_url'),
    # path("result/", views.FirstResultView.as_view(), name='first_result_url')
    path("result/",views.FirstResult)
]
