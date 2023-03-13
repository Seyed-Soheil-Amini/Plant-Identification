from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from .models import Plant
from .serializers import PlantSerializer
import random


@api_view(['GET'])
def randomPlant(request):
    p = Plant.objects.order_by('?')[0]
    return Response(PlantSerializer(p).data)
