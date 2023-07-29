import os
import re
import shutil
import uuid
from os.path import normpath, join

from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404, HttpRequest
import requests
from rest_framework import serializers

from Plant_Identification.settings import BASE_DIR
from auth_api.authentication import CustomJWTAuthentication
from .models import Plant, Leaf, Stem, Flower, Medicine, MedicinalUnit, Habitat, Fruit
from .serializers import PlantSerializer, LeafSerializer, StemSerializer, FlowerSerializer, MedicinalSerializer, \
    HabitatSerializer, FruitSerializer, IMAGE_DIR_SER



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
        aparat_id = None
        if request.data.get('aparat_video_link') != '':
            aparat_clip_url = request.data.get('aparat_video_link')
            regex = r"^(?:https?:\/\/)?(?:www\.)?aparat\.com\/v\/([A-Za-z0-9]+)(([!\"#$%\[\]&\'()*+,-.:;<=>?@^_`{|}~\\\/]).*|($))"
            match = re.match(regex, aparat_clip_url)
            if match:
                video_id = match.group(1)  # Output: U1lFp
                aparat_id = video_id
            else:
                return Response(data="Video link is not correct!", status=status.HTTP_400_BAD_REQUEST)

            response_test_video = requests.get(f"https://www.aparat.com/etc/api/video/videohash/{aparat_id}").json()
            if response_test_video.get('video').get('size') is None:
                return Response(data="Video not found!", status=status.HTTP_400_BAD_REQUEST)
        address = uuid.uuid4().__str__()[25:36]
        try:
            serializer = PlantSerializer(data=request.data,
                                     context={'request': request, 'address': address, 'video_id': aparat_id})
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                if not bool(serializer.errors):
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except serializers.ValidationError as e:
            return Response({"error": e.detail}, status=status.HTTP_400_BAD_REQUEST)


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
        aparat_id = None
        if request.data.get('aparat_video_link') != '':
            aparat_clip_url = request.data.get('aparat_video_link')
            regex = r"^(?:https?:\/\/)?(?:www\.)?aparat\.com\/v\/([A-Za-z0-9]+)(([!\"#$%\[\]&\'()*+,-.:;<=>?@^_`{|}~\\\/]).*|($))"
            match = re.match(regex, aparat_clip_url)
            if match:
                video_id = match.group(1)  # Output: U1lFp
                aparat_id = video_id
            else:
                return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
            response_test_video = requests.get(f"https://www.aparat.com/etc/api/video/videohash/{aparat_id}").json()
            if response_test_video.get('video').get('size') is None:
                return Response(data="Video not found!", status=status.HTTP_404_NOT_FOUND)
        plant = self.get_object(pk)
        serializer = PlantSerializer(plant, data=request.data,
                                     context={'request': request, 'pk': pk, 'video_id': aparat_id})
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                if not bool(serializer.errors):
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except serializers.ValidationError as e:
            return Response({"error": e.detail}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        plant = self.get_object(pk)
        folder_path = normpath(join(BASE_DIR, "media/mainImages/", plant.pre_path))
        plant.delete()
        shutil.rmtree(folder_path)
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['DELETE'])
@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
def delete_plants(request):
    deleted_plants_id = request.data.getlist('id')
    for id in range(0, len(deleted_plants_id)):
        deleted_obj = Plant.objects.get(pk=deleted_plants_id[id])
        folder_path = normpath(join(BASE_DIR, "media/mainImages/", deleted_obj.pre_path))
        deleted_obj.delete()
        shutil.rmtree(folder_path)
    return Response(status=status.HTTP_204_NO_CONTENT)


class PlantLeafImageList(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        leafs = Leaf.objects.all()
        serializer = LeafSerializer(leafs, many=True)
        return Response(serializer.data)

    def post(self, request):
        leaf_images = request.FILES.getlist('leaf_image_set')
        if len(leaf_images) != 0:
            plant_instance = Plant.objects.get(pk=request.data.get('plant_id'))
            leaf_inventory = Leaf.objects.filter(plant=plant_instance)
            if len(leaf_inventory) + len(leaf_images) > 100:
                return Response("The number of photos submitted has exceeded the limit.",
                                status=status.HTTP_400_BAD_REQUEST)
            user_instance = User.objects.get(username=request.user)
            try:
                for leaf in leaf_images:
                    Leaf.objects.create(plant=plant_instance, user=user_instance,
                                        **{'image': leaf})
                return Response("Leafs of plant is saved successfully", status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_200_OK)


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
        stem_images = request.FILES.getlist('stem_image_set')
        if len(stem_images) != 0:
            plant_instance = Plant.objects.get(pk=request.data.get('plant_id'))
            stem_inventory = Stem.objects.filter(plant=plant_instance)
            if len(stem_inventory) + len(stem_images) > 100:
                return Response("The number of photos submitted has exceeded the limit.",
                                status=status.HTTP_400_BAD_REQUEST)
            user_instance = User.objects.get(username=request.user)
            try:
                for stem in stem_images:
                    Stem.objects.create(plant=plant_instance, user=user_instance,
                                        **{'image': stem})
                return Response("Stems of plant is saved successfully", status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_200_OK)


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
        flower_images = request.FILES.getlist('flower_image_set')
        if len(flower_images) != 0:
            plant_instance = Plant.objects.get(pk=request.data.get('plant_id'))
            flower_inventory = Flower.objects.filter(plant=plant_instance)
            if len(flower_inventory) + len(flower_images) > 100:
                return Response("The number of photos submitted has exceeded the limit.",
                                status=status.HTTP_400_BAD_REQUEST)
            user_instance = User.objects.get(username=request.user)
            try:
                for flower in flower_images:
                    Flower.objects.create(plant=plant_instance, user=user_instance,
                                          **{'image': flower})
                return Response("Flowers of plant is saved successfully", status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_200_OK)


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
        habitat_images = request.FILES.getlist('habitat_image_set')
        if len(habitat_images) != 0:
            plant_instance = Plant.objects.get(pk=request.data.get('plant_id'))
            habitat_inventory = Habitat.objects.filter(plant=plant_instance)
            if len(habitat_inventory) + len(habitat_images) > 100:
                return Response("The number of photos submitted has exceeded the limit.",
                                status=status.HTTP_400_BAD_REQUEST)
            user_instance = User.objects.get(username=request.user)
            try:
                for habitat in habitat_images:
                    Habitat.objects.create(plant=plant_instance, user=user_instance,
                                           **{'image': habitat})
                return Response("Habitats of plant is saved successfully", status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_200_OK)


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
        fruit_images = request.FILES.getlist('fruit_image_set')
        if len(fruit_images) != 0:
            plant_instance = Plant.objects.get(pk=request.data.get('plant_id'))
            fruit_inventory = Fruit.objects.filter(plant=plant_instance)
            if len(fruit_inventory) + len(fruit_images) > 100:
                return Response("The number of photos submitted has exceeded the limit.",
                                status=status.HTTP_400_BAD_REQUEST)
            user_instance = User.objects.get(username=request.user)
            try:
                for fruit in fruit_images:
                    Fruit.objects.create(plant=plant_instance, user=user_instance,
                                         **{'image': fruit})
                return Response("Fruits of plant is saved successfully", status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_200_OK)


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


@authentication_classes([CustomJWTAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def check_valid_video(request):
    aparat_clip_url = request.data.get('aparat_video_link')
    regex = r"^(?:https?:\/\/)?(?:www\.)?aparat\.com\/v\/([A-Za-z0-9]+)(([!\"#$%\[\]&\'()*+,-.:;<=>?@^_`{|}~\\\/]).*|($))"
    match = re.search(regex, aparat_clip_url)
    if match:
        video_id = match.group(1)  # Output: U1lFp
        aparat_id = video_id
    else:
        return Response(data="Video link is not correct!", status=status.HTTP_400_BAD_REQUEST)
    if not bool(Plant.objects.filter(video_aparat_id=aparat_id)):
        response_test_video = requests.get(f"https://www.aparat.com/etc/api/video/videohash/{aparat_id}").json()
        if response_test_video.get('video').get('size') is None:
            return Response(data="Video not found!", status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_200_OK)
    else:
        return Response(data="Video link already exits!", status=status.HTTP_400_BAD_REQUEST)
