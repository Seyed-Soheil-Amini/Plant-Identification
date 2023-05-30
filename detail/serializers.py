from rest_framework import serializers

from .models import *


class LeafSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leaf
        fields = ['image', 'plant']


class StemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stem
        fields = ['image', 'plant']


class FlowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flower
        fields = ['image', 'plant']


class PlantSerializer(serializers.ModelSerializer):
    leaf_image_set = LeafSerializer(many=True)
    stem_image_set = StemSerializer(many=True)
    flower_image_set = FlowerSerializer(many=True)

    class Meta:
        model = Plant
        fields = ['id', 'persian_name', 'image', 'scientific_name', 'family', 'morphology', 'flowering_time',
                  'geographical_distribution',
                  'ecology',
                  'medicinal_properties',
                  'habitat_characteristics', 'climate', 'soil_characteristics', 'more_info',
                  'leaf_image_set', 'stem_image_set', 'flower_image_set']

    def create(self, validated_data):
        leaf_images = validated_data.pop('leaf_image_set')
        stem_images = validated_data.pop('stem_image_set')
        flower_images = validated_data.pop('flower_image_set')
        plant = Plant.objects.create(**validated_data)
        for leaf in leaf_images:
            Leaf.objects.create(plant=plant, **leaf)
        for stem in stem_images:
            Stem.objects.create(plant=plant, **stem)
        for flower in flower_images:
            Flower.objects.create(plant=plant, **flower)
        return Plant

#
# class PartialPlantSerializer(PlantSerializer):
#     class Meta:
#         model = Plant
#         fields = ['id', 'main_image', 'persian_name', 'flowering_time', 'scientific_name', 'family']
