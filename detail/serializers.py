import shutil

import django

django.setup()
import os
import io
import threading
from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile
from django.core.files.base import ContentFile
from multiprocessing import Pool, Process
from itertools import repeat
from rest_framework import serializers
from functools import partial

from .models import *

from Plant_Identification.local_setting import WINDOWS_OR_UBUNTU

IMAGE_DIR_SER = f'media{WINDOWS_OR_UBUNTU}mainImages{WINDOWS_OR_UBUNTU}'
IMAGE_DIR_NEW = f'mainImages{WINDOWS_OR_UBUNTU}'


class MedicinalUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicinalUnit
        fields = ['id', 'plant', 'medicine']


class MedicinalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = ['id', 'property_name']


class LeafSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leaf
        fields = ['id', 'plant', 'image', 'user']


class StemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stem
        fields = ['id', 'plant', 'image', 'user']


class FlowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flower
        fields = ['id', 'plant', 'image', 'user']


class HabitatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habitat
        fields = ['id', 'plant', 'image', 'user']


class FruitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fruit
        fields = ['id', 'plant', 'image', 'user']


class PlantSerializer(serializers.ModelSerializer):
    medicinal_properties = MedicinalUnitSerializer(many=True, read_only=True)
    leaf_image_set = LeafSerializer(many=True, read_only=True)
    stem_image_set = StemSerializer(many=True, read_only=True)
    flower_image_set = FlowerSerializer(many=True, read_only=True)
    habitat_image_set = HabitatSerializer(many=True, read_only=True)
    fruit_image_set = FruitSerializer(many=True, read_only=True)

    class Meta:
        model = Plant
        fields = ['id', 'persian_name', 'image', 'scientific_name', 'family', 'morphology', 'flowering_time',
                  'geographical_distribution',
                  'ecology',
                  'habitat_characteristics', 'climate', 'soil_characteristics', 'more_info', 'video_iframe_link',
                  'adder_user', 'editor_user', 'medicinal_properties',
                  'leaf_image_set', 'stem_image_set', 'flower_image_set', 'habitat_image_set', 'fruit_image_set', ]

    def get_object(self, model_name, pk):
        try:
            return model_name.objects.get(pk=pk)
        except model_name.DoesNotExist:
            return None

    @staticmethod
    def compress(image_files, args):
        model_name, instance, user, delete_need = args
        for i, image_file in enumerate(image_files):
            file_path = image_file.temporary_file_path() if isinstance(image_file,
                                                                       TemporaryUploadedFile) else image_file
            with Image.open(file_path) as image:
                guess = 70
                low = 1
                high = 100
                size = 1024 * 1024 * 1.25
                while low < high:
                    buffer = io.BytesIO()
                    image.save(fp=buffer, format=image_file.content_type.split(WINDOWS_OR_UBUNTU)[1], optimize=True, quality=guess)
                    if buffer.getbuffer().nbytes < size:
                        low = guess
                    else:
                        high = guess - 1
                    guess = (low + high + 1) // 2
            try:
                model_name.objects.create(plant=instance, user=user,
                                          **{'image': ContentFile(buffer.getvalue(), name=image_file)})
            except:
                if delete_need:
                    image_path = instance.image.path
                    instance.delete()
                    image_path = image_path[0: image_path.rindex(WINDOWS_OR_UBUNTU) + 1]
                    shutil.rmtree(image_path)
                raise Exception

    def add_images(self, images, model_name, instance, user, must_delete):
        threads = []
        step = len(images) // 8 if len(images) >= 8 else 1
        for i in range(0, len(images), step):
            thread = threading.Thread(target=PlantSerializer.compress,
                                      args=(images[i:i + step], (model_name, instance, user, must_delete),))
            threads.append(thread)
            thread.start()

        return threads
        # with Pool(processes=4) as pool:
        #     results = pool.map(partial(PlantSerializer.compress, args=(model_name, instance, user)), images)

    def create(self, validated_data):
        medicinal_props = self.context.get('request').data.getlist('medicinal_properties')
        leaf_images = self.context.get('request').FILES.getlist('leaf_image_set')
        stem_images = self.context.get('request').FILES.getlist('stem_image_set')
        flower_images = self.context.get('request').FILES.getlist('flower_image_set')
        habitat_images = self.context.get('request').FILES.getlist('habitat_image_set')
        fruit_images = self.context.get('request').FILES.getlist('fruit_image_set')
        user = User.objects.get(username=self.context.get('request').user)
        file_pre_address = self.context.get('address')
        # file must be created here
        if len(leaf_images) > 100 or len(stem_images) > 100 or len(flower_images) > 100 or len(
                habitat_images) > 100 or len(fruit_images) > 100:
            raise Exception("The limit of the number of photos sent has not been respected.")
        else:
            os.mkdir(IMAGE_DIR_SER + file_pre_address)
            file_path = os.path.join(IMAGE_DIR_SER + file_pre_address, 'info.txt')
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(str(validated_data))
            plant = Plant.objects.create(adder_user=user, editor_user=user, pre_path=file_pre_address,
                                         info_file='info.txt',
                                         **validated_data)
            for medicine in range(0, len(medicinal_props)):
                MedicinalUnit.objects.create(plant=plant, medicine=Medicine.objects.get(pk=medicinal_props[medicine]))
            threads = []
            threads.extend(self.add_images(leaf_images, Leaf, plant, user, True))
            threads.extend(self.add_images(stem_images, Stem, plant, user, True))
            threads.extend(self.add_images(flower_images, Flower, plant, user, True))
            threads.extend(self.add_images(habitat_images, Habitat, plant, user, True))
            threads.extend(self.add_images(fruit_images, Fruit, plant, user, True))
            for thread in threads:
                thread.join()
        return plant

    def update(self, instance, validated_data):
        new_image = self.context.get('request').FILES.get('image')
        medicinal_props = self.context.get('request').data.getlist('medicinal_properties')
        leaf_images = self.context.get('request').FILES.getlist('leaf_image_set')
        stem_images = self.context.get('request').FILES.getlist('stem_image_set')
        flower_images = self.context.get('request').FILES.getlist('flower_image_set')
        habitat_images = self.context.get('request').FILES.getlist('habitat_image_set')
        fruit_images = self.context.get('request').FILES.getlist('fruit_image_set')
        user = User.objects.get(username=self.context.get('request').user)
        leaf_images_inventory = Leaf.objects.filter(plant=instance)
        stem_images_inventory = Stem.objects.filter(plant=instance)
        flower_images_inventory = Flower.objects.filter(plant=instance)
        habitat_images_inventory = Habitat.objects.filter(plant=instance)
        fruit_images_inventory = Fruit.objects.filter(plant=instance)

        if len(leaf_images_inventory) + len(leaf_images) > 100 or len(stem_images_inventory) + len(
                stem_images) > 100 or len(
            flower_images_inventory) + len(flower_images) > 100 or len(
            habitat_images_inventory) + len(habitat_images) > 100 or len(fruit_images_inventory) + len(fruit_images) > 100:
            raise Exception("The limit of the number of photos sent has not been respected.")
        else:
            threads = []
            if leaf_images is not None:
                threads.extend(self.add_images(leaf_images, Leaf, instance, user, False))
            if stem_images is not None:
                threads.extend(self.add_images(stem_images, Stem, instance, user, False))
            if flower_images is not None:
                threads.extend(self.add_images(flower_images, Flower, instance, user, False))
            if habitat_images is not None:
                threads.extend(self.add_images(habitat_images, Habitat, instance, user, False))
            if fruit_images is not None:
                threads.extend(self.add_images(fruit_images, Fruit, instance, user, False))
            for thread in threads:
                thread.join()
            if new_image is not None:
                image_field = validated_data.pop('image')
                os.remove(instance.image.path)
                string_filename = str(new_image)
                ext = string_filename[string_filename.rfind("."):len(string_filename)]
                filename = os.path.join(IMAGE_DIR_SER + instance.pre_path, instance.pre_path[::-1] + ext)
                filename_to_database = os.path.join(IMAGE_DIR_NEW + instance.pre_path, instance.pre_path[::-1] + ext)
                with open(filename, 'wb+') as f:
                    for chunk in image_field.chunks():
                        f.write(chunk)
                plant = Plant.objects.filter(pk=self.context.get('pk')).update(editor_user=user,
                                                                               image=filename_to_database,
                                                                               **validated_data)
            else:
                plant = Plant.objects.filter(pk=self.context.get('pk')).update(editor_user=user, **validated_data)
            file_path = os.path.join(IMAGE_DIR_SER + instance.pre_path, 'info.txt')
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write((Plant.objects.get(pk=instance.pk)).__str_to_file__())

            if medicinal_props is not None:
                for medicine in range(0, len(medicinal_props)):
                    MedicinalUnit.objects.create(plant=instance,
                                                 medicine=Medicine.objects.get(pk=medicinal_props[medicine]))
            return Plant.objects.get(pk=instance.pk)
