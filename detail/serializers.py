from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import *

IMAGE_DIR_SER = normpath(join('media', 'mainImages'))


class ThumbnailSerializer(serializers.ModelSerializer):
    thumbnail_image = serializers.SerializerMethodField()

    class Meta:
        fields = ['thumbnail_image']
        abstract = True

    def get_thumbnail_image(self, obj):
        try:
            return f'/process-image{obj.image.url}'
        except Exception:
            raise ValidationError('thumbnail create link error!')


class MedicinalUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicinalUnit
        fields = ['id', 'plant', 'medicine']


class MedicinalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = ['id', 'property_name']


class LeafSerializer(ThumbnailSerializer):
    class Meta:
        model = Leaf
        fields = ['id', 'plant', 'user', 'image'] + ThumbnailSerializer.Meta.fields


class StemSerializer(ThumbnailSerializer):
    class Meta:
        model = Stem
        fields = ['id', 'plant', 'image', 'user'] + ThumbnailSerializer.Meta.fields


class FlowerSerializer(ThumbnailSerializer):
    class Meta:
        model = Flower
        fields = ['id', 'plant', 'image', 'user'] + ThumbnailSerializer.Meta.fields


class HabitatSerializer(ThumbnailSerializer):
    class Meta:
        model = Habitat
        fields = ['id', 'plant', 'image', 'user'] + ThumbnailSerializer.Meta.fields


class FruitSerializer(ThumbnailSerializer):
    class Meta:
        model = Fruit
        fields = ['id', 'plant', 'image', 'user'] + ThumbnailSerializer.Meta.fields


class PlantSerializer(ThumbnailSerializer):
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
                  'leaf_image_set', 'stem_image_set', 'flower_image_set', 'habitat_image_set',
                  'fruit_image_set', ] + ThumbnailSerializer.Meta.fields

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
        if self.context.get('video_id') == '':
            instance.video_aparat_id = None
        elif self.context.get('video_id') is not None:
            instance.video_aparat_id = self.context.get('video_id')
        instance.save()

        file_path = normpath(join(IMAGE_DIR_SER, instance.pre_path, 'info.txt'))
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write((Plant.objects.get(pk=instance.pk)).__str_to_file__())

        if medicinal_props is not None:
            for medicine in medicinal_props:
                MedicinalUnit.objects.create(plant=instance,
                                             medicine=Medicine.objects.get(pk=medicine))
        return instance


class PlantIdentifySerializer(ThumbnailSerializer):
    other_images = serializers.SerializerMethodField()

    class Meta:
        model = Plant
        fields = ['id', 'persian_name', 'scientific_name', 'family', 'image',
                  'other_images'] + ThumbnailSerializer.Meta.fields

    def get_other_images(self, obj):
        serialized_image_list = []
        plant_leaf_image = Leaf.objects.filter(plant=obj).order_by('?').first()
        if plant_leaf_image is not None:
            serialized_image_list.append(LeafSerializer(plant_leaf_image).data)

        plant_stem_image = Stem.objects.filter(plant=obj).order_by('?').first()
        if plant_stem_image is not None:
            serialized_image_list.append(StemSerializer(plant_stem_image).data)

        plant_flower_image = Flower.objects.filter(plant=obj).order_by('?').first()
        if plant_flower_image is not None:
            serialized_image_list.append(FlowerSerializer(plant_flower_image).data)

        plant_fruit_image = Fruit.objects.filter(plant=obj).order_by('?').first()
        if plant_fruit_image is not None:
            serialized_image_list.append(FruitSerializer(plant_fruit_image).data)
        return serialized_image_list
