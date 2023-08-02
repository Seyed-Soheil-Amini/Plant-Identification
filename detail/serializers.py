from os.path import normpath, join

import django

django.setup()
import os
from rest_framework import serializers

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
    threadErrors = []
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
                  'habitat_characteristics', 'climate', 'soil_characteristics', 'more_info', 'video_aparat_id',
                  'adder_user', 'editor_user', 'medicinal_properties',
                  'leaf_image_set', 'stem_image_set', 'flower_image_set', 'habitat_image_set', 'fruit_image_set', ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def get_object(self, model_name, pk):
        try:
            return model_name.objects.get(pk=pk)
        except model_name.DoesNotExist:
            return None

    # @staticmethod
    # def compress(image_files, args):
    #     if len(PlantSerializer.threadErrors) > 0:
    #         return
    #
    #     model_name, instance, user, delete_need = args
    #     for i, image_file in enumerate(image_files):
    #         file_path = image_file.temporary_file_path() if isinstance(image_file,
    #                                                                    TemporaryUploadedFile) else image_file
    #         with Image.open(file_path) as image:
    #             guess = 70
    #             low = 1
    #             high = 100
    #             size = 1024 * 1024 * 1.25
    #             while low < high:
    #                 buffer = io.BytesIO()
    #                 image.save(fp=buffer, format=image_file.content_type.split('/')[1], optimize=True, quality=guess)
    #                 if buffer.getbuffer().nbytes < size:
    #                     low = guess
    #                 else:
    #                     high = guess - 1
    #                 guess = (low + high + 1) // 2
    #         try:
    #             model_name.objects.create(plant=instance, user=user,
    #                                       **{'image': ContentFile(buffer.getvalue(), name=image_file)})
    #         except:
    #             if delete_need:
    #                 folder_path = normpath(join(BASE_DIR, IMAGE_DIR_SER, instance.pre_path))
    #                 instance.delete()
    #                 shutil.rmtree(folder_path)
    #             PlantSerializer.threadErrors.append(serializers.ValidationError("error"))
    #
    # def add_images(self,images, model_name, instance, user, must_delete):
    #     threads = []
    #     step = len(images) // 8 if len(images) >= 8 else 1
    #     for i in range(0, len(images), step):
    #         thread = threading.Thread(target=self.compress,
    #                                   args=(images[i:i + step], (model_name, instance, user, must_delete),))
    #         threads.append(thread)
    #         thread.start()
    #
    #     return threads

    # with Pool(processes=4) as pool:
    #     results = pool.map(partial(compress, args=(model_name, instance, user)), images)

    def create(self, validated_data):
        medicinal_props = self.context.get('request').data.getlist('medicinal_properties')
        user = User.objects.get(username=self.context.get('request').user)
        file_pre_address = self.context.get('address')
        os.mkdir(IMAGE_DIR_SER + file_pre_address)
        file_path = os.path.join(IMAGE_DIR_SER + file_pre_address, 'info.txt')
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(str(validated_data))
        try:
            plant = Plant.objects.create(adder_user=user, editor_user=user, pre_path=file_pre_address,
                                         info_file='info.txt', video_aparat_id=self.context.get('video_id'),
                                         **validated_data)
            for medicine in range(0, len(medicinal_props)):
                MedicinalUnit.objects.create(plant=plant, medicine=Medicine.objects.get(pk=medicinal_props[medicine]))
            return plant
        except Exception as e:
            plant.delete()
            raise e

    def update(self, instance, validated_data):
        new_image = self.context.get('request').FILES.get('image')
        medicinal_props = self.context.get('request').data.getlist('medicinal_properties')
        user = User.objects.get(username=self.context.get('request').user)
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
                                                                           video_aparat_id=self.context.get(
                                                                               'video_id'),
                                                                           **validated_data)
        else:
            plant = Plant.objects.filter(pk=self.context.get('pk')).update(editor_user=user,
                                                                           video_aparat_id=self.context.get(
                                                                               'video_id')
                                                                           , **validated_data)
        file_path = os.path.join(IMAGE_DIR_SER + instance.pre_path, 'info.txt')
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write((Plant.objects.get(pk=instance.pk)).__str_to_file__())

            if medicinal_props is not None:
                for medicine in range(0, len(medicinal_props)):
                    MedicinalUnit.objects.create(plant=instance,
                                                 medicine=Medicine.objects.get(pk=medicinal_props[medicine]))
            return Plant.objects.get(pk=instance.pk)

        # medicinal_props = self.context.get('request').data.getlist('medicinal_properties')
        #
        # if 'image' in validated_data and os.path.exists(normpath(instance.image.path)):
        #     os.remove(normpath(instance.image.path))
        #
        # for field, value in validated_data.items():
        #     setattr(instance, field, value)
        # instance.save()
        #
        # file_path = normpath(join(IMAGE_DIR_SER, instance.pre_path, 'info.txt'))
        # with open(file_path, 'w', encoding='utf-8') as f:
        #     f.write((Plant.objects.get(pk=instance.pk)).__str_to_file__())
        #
        # if medicinal_props is not None:
        #     for medicine in medicinal_props:
        #         MedicinalUnit.objects.create(plant=instance,
        #                                      medicine=Medicine.objects.get(pk=medicine))
        #
        # return instance

