import os

from rest_framework import serializers

from .models import *

IMAGE_DIR_SER = 'media\\mainImages\\'
IMAGE_DIR_NEW = 'mainImages\\'


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


class PlantSerializer(serializers.ModelSerializer):
    medicinal_properties = MedicinalUnitSerializer(many=True, read_only=True)
    leaf_image_set = LeafSerializer(many=True, read_only=True)
    stem_image_set = StemSerializer(many=True, read_only=True)
    flower_image_set = FlowerSerializer(many=True, read_only=True)
    habitat_image_set = HabitatSerializer(many=True, read_only=True)

    class Meta:
        model = Plant
        fields = ['id', 'persian_name', 'image', 'scientific_name', 'family', 'morphology', 'flowering_time',
                  'geographical_distribution',
                  'ecology',
                  'habitat_characteristics', 'climate', 'soil_characteristics', 'more_info', 'video_iframe_link',
                  'adder_user', 'editor_user', 'medicinal_properties',
                  'leaf_image_set', 'stem_image_set', 'flower_image_set', 'habitat_image_set']

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
        habitat_images = self.context.get('request').FILES.getlist('habitat_image_set')
        user = User.objects.get(username=self.context.get('request').user)
        file_pre_address = self.context.get('address')
        # file must be created here
        os.mkdir(IMAGE_DIR_SER + file_pre_address)
        file_path = os.path.join(IMAGE_DIR_SER + file_pre_address, 'info.txt')
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(str(validated_data))
        plant = Plant.objects.create(adder_user=user, editor_user=user, pre_path=file_pre_address, info_file='info.txt',
                                     **validated_data)
        for medicine in range(0, len(medicinal_props)):
            MedicinalUnit.objects.create(plant=plant, medicine=Medicine.objects.get(pk=medicinal_props[medicine]))
        for leaf in range(0, len(leaf_images)):
            Leaf.objects.create(plant=plant, user=user, **{'image': leaf_images[leaf]})
        for stem in range(0, len(stem_images)):
            Stem.objects.create(plant=plant, user=user, **{'image': stem_images[stem]})
        for flower in range(0, len(flower_images)):
            Flower.objects.create(plant=plant, user=user, **{'image': flower_images[flower]})
        for habitat in range(0, len(habitat_images)):
            Habitat.objects.create(plant=plant, user=user, **{'image': habitat_images[habitat]})

        return plant

    def update(self, instance, validated_data):
        new_image = self.context.get('request').FILES.get('image')
        medicinal_props = self.context.get('request').data.getlist('medicine_unit')
        leaf_images = self.context.get('request').FILES.getlist('leaf_image_set')
        stem_images = self.context.get('request').FILES.getlist('stem_image_set')
        flower_images = self.context.get('request').FILES.getlist('flower_image_set')
        habitat_images = self.context.get('request').FILES.getlist('habitat_image_set')
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
            plant = Plant.objects.update(editor_user=user, image=filename_to_database, **validated_data)
        else:
            plant = Plant.objects.update(editor_user=user, **validated_data)

        file_path = os.path.join(IMAGE_DIR_SER + instance.pre_path, 'info.txt')
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write((Plant.objects.get(pk=instance.pk)).__str_to_file__())
        if medicinal_props is not None:
            for medicine in range(0, len(medicinal_props)):
                MedicinalUnit.objects.create(plant=instance, medicine=Medicine.objects.get(pk=medicinal_props[medicine]))
        if leaf_images is not None:
            for leaf in range(0, len(leaf_images)):
                Leaf.objects.create(plant=instance, user=user, **{'image': leaf_images[leaf]})
        if stem_images is not None:
            for stem in range(0, len(stem_images)):
                Stem.objects.create(plant=instance, user=user, **{'image': stem_images[stem]})
        if flower_images is not None:
            for flower in range(0, len(flower_images)):
                Flower.objects.create(plant=instance, user=user, **{'image': flower_images[flower]})
        if habitat_images is not None:
            for habitat in range(0, len(habitat_images)):
                Habitat.objects.create(plant=instance, user=user, **{'image': habitat_images[habitat]})
        return Plant.objects.get(pk=instance.pk)
