import os
import shutil
import uuid

from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404

from auth_api.authentication import CustomJWTAuthentication
from .models import Plant, Leaf, Stem, Flower, Medicine, MedicinalUnit, Habitat, Fruit
from .serializers import PlantSerializer, LeafSerializer, StemSerializer, FlowerSerializer, MedicinalSerializer, \
    HabitatSerializer, FruitSerializer


@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def random_plants(request):
    plants = Plant.objects.order_by('?')
    return Response(PlantSerializer(plants, many=True).data)


class PlantList(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        plants = Plant.objects.all()
        serializer = PlantSerializer(plants, many=True)
        return Response(serializer.data)

    def post(self, request):
        address = uuid.uuid4().__str__()[25:36]
        serializer = PlantSerializer(data=request.data, context={'request': request, 'address': address})
        if serializer.is_valid():
            serializer.save()
            if not bool(serializer.errors):
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlantDetail(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Plant.objects.get(pk=pk)
        except Plant.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        plant = self.get_object(pk)
        serializer = PlantSerializer(plant)
        return Response(serializer.data)

    def put(self, request, pk):
        plant = self.get_object(pk)
        serializer = PlantSerializer(plant, data=request.data, context={'request': request, 'pk': pk})
        if serializer.is_valid():
            serializer.save()
            if not bool(serializer.errors):
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        plant = self.get_object(pk)
        image_path = plant.image.path
        plant.delete()
        image_path = image_path[0: image_path.rindex('/') + 1]
        shutil.rmtree(image_path)
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['DELETE'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def delete_plants(request):
    deleted_plants_id = request.data.getlist('id')
    for id in range(0, len(deleted_plants_id)):
        deleted_obj = Plant.objects.get(pk=deleted_plants_id[id])
        image_path = deleted_obj.image.path
        deleted_obj.delete()
        image_path = image_path[0: image_path.rindex('/') + 1]
        shutil.rmtree(image_path)
    return Response(status=status.HTTP_204_NO_CONTENT)


class PlantLeafImageList(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        leafs = Leaf.objects.all()
        serializer = LeafSerializer(leafs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = LeafSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlantLeafImageDetail(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Leaf.objects.get(pk=pk)
        except Plant.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        leaf = self.get_object(pk)
        serializer = LeafSerializer(leaf)
        return Response(serializer.data)

    def put(self, request, pk):
        leaf = self.get_object(pk)
        old_image_path = leaf.image.path
        if os.path.isfile(old_image_path):
            os.remove(old_image_path)

        serializer = LeafSerializer(leaf, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(template_name='not_found.html', status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        leaf = self.get_object(pk)
        image_path = leaf.image.path
        leaf.delete()
        if os.path.isfile(image_path):
            os.remove(image_path)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PlantStemImageList(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stems = Stem.objects.all()
        serializer = StemSerializer(stems, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = StemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlantStemImageDetail(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Stem.objects.get(pk=pk)
        except Stem.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        stem = Stem.objects.get(pk=pk)
        serializer = StemSerializer(stem)
        return Response(serializer.data)

    def put(self, request, pk):
        stem = self.get_object(pk)
        old_image_path = stem.image.path
        if os.path.isfile(old_image_path):
            os.remove(old_image_path)
        # based on how to call serializer by different parameter in each function,it can do what you want
        # for example below line,stem is old data , request.data is new data,then serializer update old data to new data
        # stem.image = request.FILES.get('image')
        # stem.save()
        serializer = StemSerializer(stem, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(template_name='not_found.html', status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        stem = self.get_object(pk)
        image_path = stem.image.path
        stem.delete()
        if os.path.isfile(image_path):
            os.remove(image_path)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PlantFlowerImageList(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        flowers = Flower.objects.all()
        serializer = FlowerSerializer(flowers, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FlowerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlantFlowerImageDetail(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Flower.objects.get(pk=pk)
        except Flower.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        flower = self.get_object(pk)
        serializer = FlowerSerializer(flower)
        return Response(serializer.data)

    def put(self, request, pk):
        flower = self.get_object(pk)
        old_image_path = flower.image.path
        if os.path.isfile(old_image_path):
            os.remove(old_image_path)
        serializer = FlowerSerializer(flower, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(template_name='not_found.html', status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        flower = self.get_object(pk)
        image_path = flower.image.path
        flower.delete()
        if os.path.isfile(image_path):
            os.remove(image_path)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PlantMedicinalList(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        medicines = Medicine.objects.all()
        serializer = MedicinalSerializer(medicines, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MedicinalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlantMedicinalDetail(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Medicine.objects.get(pk=pk)
        except Medicine.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        medicine = self.get_object(pk)
        serializer = MedicinalSerializer(medicine)
        return Response(serializer.data)

    def put(self, request, pk):
        medicine = self.get_object(pk)
        serializer = Medicine(medicine, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(template_name='not_found.html', status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        medicine = self.get_object(pk)
        medicine.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['DELETE'])
def delete_plants_data(request):
    deleted_medicines_id = request.data.getlist('medicine_id')
    deleted_leafs_id = request.data.getlist('leaf_id')
    deleted_stems_id = request.data.getlist('stem_id')
    deleted_flowers_id = request.data.getlist('flower_id')
    deleted_habitats_id = request.data.getlist('habitat_id')
    deleted_fruits_id = request.data.getlist('fruit_id')
    for id in range(0, len(deleted_medicines_id)):
        deleted_obj = MedicinalUnit.objects.get(pk=deleted_medicines_id[id])
        deleted_obj.delete()
    for id in range(0, len(deleted_leafs_id)):
        deleted_obj = Leaf.objects.get(pk=deleted_leafs_id[id])
        image_path = deleted_obj.image.path
        deleted_obj.delete()
        os.remove(image_path)
    for id in range(0, len(deleted_stems_id)):
        deleted_obj = Stem.objects.get(pk=deleted_stems_id[id])
        image_path = deleted_obj.image.path
        deleted_obj.delete()
        os.remove(image_path)
    for id in range(0, len(deleted_flowers_id)):
        deleted_obj = Flower.objects.get(pk=deleted_flowers_id[id])
        image_path = deleted_obj.image.path
        deleted_obj.delete()
        os.remove(image_path)
    for id in range(0, len(deleted_habitats_id)):
        deleted_obj = Habitat.objects.get(pk=deleted_habitats_id[id])
        image_path = deleted_obj.image.path
        deleted_obj.delete()
        os.remove(image_path)
    for id in range(0, len(deleted_fruits_id)):
        deleted_obj = Fruit.objects.get(pk=deleted_fruits_id[id])
        image_path = deleted_obj.image.path
        deleted_obj.delete()
        os.remove(image_path)
    return Response(status=status.HTTP_204_NO_CONTENT)


class PlantHabitatImageList(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        habitats = Habitat.objects.all()
        serializer = HabitatSerializer(habitats, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = HabitatSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlantHabitatImageDetail(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Habitat.objects.get(pk=pk)
        except Habitat.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        habitat = self.get_object(pk)
        serializer = HabitatSerializer(habitat)
        return Response(serializer.data)

    def put(self, request, pk):
        habitat = self.get_object(pk)
        old_image_path = habitat.image.path
        if os.path.isfile(old_image_path):
            os.remove(old_image_path)

        serializer = HabitatSerializer(habitat, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(template_name='not_found.html', status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        habitat = self.get_object(pk)
        image_path = habitat.image.path
        habitat.delete()
        if os.path.isfile(image_path):
            os.remove(image_path)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PlantFruitImageList(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        fruits = Fruit.objects.all()
        serializer = FruitSerializer(fruits, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FruitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlantFruitImageDetail(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Fruit.objects.get(pk=pk)
        except Fruit.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        fruit = self.get_object(pk)
        serializer = FruitSerializer(fruit)
        return Response(serializer.data)

    def put(self, request, pk):
        fruit = self.get_object(pk)
        old_image_path = fruit.image.path
        if os.path.isfile(old_image_path):
            os.remove(old_image_path)

        serializer = FruitSerializer(fruit, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(template_name='not_found.html', status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        fruit = self.get_object(pk)
        image_path = fruit.image.path
        fruit.delete()
        if os.path.isfile(image_path):
            os.remove(image_path)
        return Response(status=status.HTTP_204_NO_CONTENT)
