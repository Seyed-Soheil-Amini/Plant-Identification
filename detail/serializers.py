import json
import os

from django.http import Http404
from rest_framework import serializers
from django.contrib.auth.models import User

from .models import *


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


class PlantSerializer(serializers.ModelSerializer):
    medicinal_properties = MedicinalUnitSerializer(many=True, read_only=True)
    # medicine_unit = MedicinalSerializer(many=True, read_only=True)
    leaf_image_set = LeafSerializer(many=True, read_only=True)
    stem_image_set = StemSerializer(many=True, read_only=True)
    flower_image_set = FlowerSerializer(many=True, read_only=True)

    class Meta:
        model = Plant
        fields = ['id', 'persian_name', 'image', 'scientific_name', 'family', 'morphology', 'flowering_time',
                  'geographical_distribution',
                  'ecology',
                  'habitat_characteristics', 'climate', 'soil_characteristics', 'more_info', 'video_iframe_link',
                  'adder_user', 'medicinal_properties',
                  'leaf_image_set', 'stem_image_set', 'flower_image_set']

    def get_object(self, model_name, pk):
        try:
            return model_name.objects.get(pk=pk)
        except model_name.DoesNotExist:
            return None

    def create(self, validated_data):
        medicinal_props = self.context.get('request').data.getlist('medicinal_properties')
        leaf_images = self.context.get('request').FILES.getlist('leaf_image_set')
        stem_images = self.context.get('request').FILES.getlist('stem_image_set')
        flower_images = self.context.get('request').FILES.getlist('flower_image_set')
        user = User.objects.get(username=self.context.get('request').user)

        plant = Plant.objects.create(adder_user=user, **validated_data)
        for medicine in range(0, len(medicinal_props)):
            MedicinalUnit.objects.create(plant=plant, medicine=Medicine.objects.get(pk=medicinal_props[medicine]))
        for leaf in range(0, len(leaf_images)):
            Leaf.objects.create(plant=plant, user=user, **{'image': leaf_images[leaf]})
        for stem in range(0, len(stem_images)):
            Stem.objects.create(plant=plant, user=user, **{'image': stem_images[stem]})
        for flower in range(0, len(flower_images)):
            Flower.objects.create(plant=plant, user=user, **{'image': flower_images[flower]})

        return plant

    def update(self, instance, validated_data):
        medicinal_props = self.context.get('request').data.getlist('medicine_unit')
        leaf_images = self.context.get('request').FILES.getlist('leaf_image_set')
        stem_images = self.context.get('request').FILES.getlist('stem_image_set')
        flower_images = self.context.get('request').FILES.getlist('flower_image_set')
        user = User.objects.get(username=self.context.get('request').user)

        plant = Plant.objects.update(adder_user=user, **validated_data)

        if medicinal_props is not None:
            for medicine in range(0, len(medicinal_props)):
                MedicinalUnit.objects.create(plant=plant, medicine=Medicine.objects.get(pk=medicinal_props[medicine]))
        if leaf_images is not None:
            for leaf in range(0, len(leaf_images)):
                Leaf.objects.create(plant=plant, user=user, **{'image': leaf_images[leaf]})
        if stem_images is not None:
            for stem in range(0, len(stem_images)):
                Stem.objects.create(plant=plant, user=user, **{'image': stem_images[stem]})
        if flower_images is not None:
            for flower in range(0, len(flower_images)):
                Flower.objects.create(plant=plant, user=user, **{'image': flower_images[flower]})

        return instance
