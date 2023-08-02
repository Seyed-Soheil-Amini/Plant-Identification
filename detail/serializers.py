from os.path import normpath, join
import os

from rest_framework import serializers

from .models import *

IMAGE_DIR_SER = normpath(join('media', 'mainImages'))


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
                  'habitat_characteristics', 'climate', 'soil_characteristics', 'more_info', 'video_aparat_id',
                  'adder_user', 'editor_user', 'medicinal_properties',
                  'leaf_image_set', 'stem_image_set', 'flower_image_set', 'habitat_image_set', 'fruit_image_set', ]

    def get_object(self, model_name, pk):
        try:
            return model_name.objects.get(pk=pk)
        except model_name.DoesNotExist:
            return None

    def create(self, validated_data):
        medicinal_props = self.context.get('request').data.getlist('medicinal_properties')
        user = User.objects.get(username=self.context.get('request').user)
        file_pre_address = self.context.get('address')
        os.mkdir(normpath(join(IMAGE_DIR_SER, file_pre_address)))
        file_path = normpath(join(IMAGE_DIR_SER, file_pre_address, 'info.txt'))
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(str(validated_data))
        try:
            plant = Plant.objects.create(adder_user=user, editor_user=user, pre_path=file_pre_address,
                                         info_file='info.txt', video_aparat_id=self.context.get('video_id'),
                                         **validated_data)
            for medicine in medicinal_props:
                MedicinalUnit.objects.create(plant=plant, medicine=Medicine.objects.get(pk=medicine))
            return plant
        except Exception as e:
            plant.delete()
            raise e

    def update(self, instance, validated_data):
        medicinal_props = self.context.get('request').data.getlist('medicinal_properties')

        if 'image' in validated_data and os.path.exists(normpath(instance.image.path)):
            os.remove(normpath(instance.image.path))

        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()

        file_path = normpath(join(IMAGE_DIR_SER, instance.pre_path, 'info.txt'))
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write((Plant.objects.get(pk=instance.pk)).__str_to_file__())

        if medicinal_props is not None:
            for medicine in medicinal_props:
                MedicinalUnit.objects.create(plant=instance,
                                             medicine=Medicine.objects.get(pk=medicine))
        return instance
