from rest_framework import serializers

from .models import *


# class ImageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Image
#         fields = ['image']


class PlantSerializer(serializers.ModelSerializer):
    image_set = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='image_url'
    )
    # image_set = ImageSerializer(many=True,read_only=True)

    class Meta:
        model = Plant
        fields = ['main_image', 'id', 'name', 'english_name', 'scientific_name', 'family', 'morphology',
                  'water_need',
                  'soil_need',
                  'salinity_tolerance', 'temperature_tolerance', 'species_score', 'first_planting_priority',
                  'second_planting_priority', 'third_planting_priority',
                  'suitable_planting_location', 'suitable_planting_combination', 'specific_characteristic',
                  'more_information', 'references', 'image_set']
