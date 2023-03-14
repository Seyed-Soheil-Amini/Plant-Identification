from rest_framework import serializers

from .models import Plant


class PlantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plant
        fields = ['id', 'name', 'english_name', 'scientific_name', 'family', 'morphology','image', 'water_need', 'soil_need',
                  'salinity_tolerance', 'temperature_tolerance', 'species_score', 'first_planting_priority',
                  'second_planting_priority', 'third_planting_priority',
                  'suitable_planting_location', 'suitable_planting_combination', 'specific_characteristic',
                  'more_information', 'references']
