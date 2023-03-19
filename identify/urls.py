from django.urls import path
from . import views

urlpatterns = [
    path("", views.IdentifyView.as_view(), name='identify_url'),
    path("detailResult/", views.ResultWithDetail.as_view(), name='detail_result_url'),
    path("result/",views.FirstResult)
]
