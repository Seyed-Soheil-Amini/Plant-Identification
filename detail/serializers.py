from rest_framework import serializers

from .models import *


class LeafSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leaf
        fields = ['image']


class StemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stem
        fields = ['image']


class FlowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flower
        fields = ['image']


class PlantSerializer(serializers.ModelSerializer):
    leaf_image_set = LeafSerializer(many=True, read_only=True)
    stem_image_set = StemSerializer(many=True, read_only=True)
    flower_image_set = FlowerSerializer(many=True, read_only=True)

    class Meta:
        model = Plant
        fields = ['id', 'persian_name', 'image', 'scientific_name', 'family', 'morphology', 'flowering_time',
                  'geographical_distribution',
                  'ecology',
                  'medicinal_properties',
                  'habitat_characteristics', 'climate', 'soil_characteristics', 'more_info', 'video_iframe_link',
                  'leaf_image_set', 'stem_image_set', 'flower_image_set']

    def create(self, validated_data):
        leaf_images = self.context.get('request').FILES.get('leaf_image_set')
        stem_images = self.context.get('request').FILES.get('stem_image_set')
        flower_images = self.context.get('request').FILES.get('flower_image_set')

        dict_leaf = {
            'image': leaf_images
        }

        dict_stem = {
            'image': stem_images
        }

        dict_flower = {
            'image': flower_images
        }

        plant = Plant.objects.create(**validated_data)
        Leaf.objects.create(plant=plant, **dict_leaf)
        Stem.objects.create(plant=plant, **dict_stem)
        Flower.objects.create(plant=plant, **dict_stem)

        return plant

#
# class PartialPlantSerializer(PlantSerializer):
#     class Meta:
#         model = Plant
#         fields = ['id', 'main_image', 'persian_name', 'flowering_time', 'scientific_name', 'family']
