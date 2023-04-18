from django.urls import path
from . import views

urlpatterns = [
    path("", views.medicinal_properties_view.as_view(), name='medicinal_url'),
]