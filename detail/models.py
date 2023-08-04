import os
from os.path import join, normpath
from PIL import Image

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User

import uuid

IMAGE_DIR = normpath('mainImages')


def set_model_path(instance, filename):
    string_filename = str(filename)
    ext = string_filename[string_filename.rfind("."):len(string_filename)]
    return normpath(join(IMAGE_DIR, instance.pre_path, instance.pre_path[::-1] + ext))


def set_model_info_file(instance, filename):
    return normpath(join(IMAGE_DIR, instance.pre_path, filename))


class Plant(models.Model):
    persian_name = models.CharField(blank=False, max_length=100, null=False, unique=True,
                                    verbose_name=_("Persian Name"))
    image = models.ImageField(upload_to=set_model_path, null=False, blank=True, verbose_name=_("Image"))
    scientific_name = models.CharField(blank=False, max_length=100, null=False, unique=True,
                                       verbose_name=_("scientific Name"))
    family = models.TextField(blank=False, null=True, verbose_name=_("Family"))
    morphology = models.TextField(blank=True, null=True, verbose_name=_("Morphology"))
    flowering_time = models.TextField(blank=True, null=True, verbose_name=_("flowering Time"))
    geographical_distribution = models.TextField(blank=True, null=True,
                                                 verbose_name=_("Geographical Distribution"))
    ecology = models.TextField(blank=True, null=True, verbose_name=_("Ecology"))
    habitat_characteristics = models.TextField(blank=True, null=True, verbose_name=_("Habitat"))
    climate = models.TextField(blank=True, null=True, verbose_name=_("Climate"))
    soil_characteristics = models.TextField(blank=True, null=True,
                                            verbose_name=_("Soil Characteristics"))
    more_info = models.TextField(blank=True, null=True, verbose_name=_("More Information"))
    video_aparat_id = models.CharField(max_length=30, null=True, blank=True, unique=True)
    adder_user = models.ForeignKey(User, null=True, related_name="adding_user", on_delete=models.DO_NOTHING)
    editor_user = models.ForeignKey(User, null=True, related_name="editor_user", on_delete=models.DO_NOTHING)
    info_file = models.FileField(verbose_name=_("Information File"), upload_to=set_model_info_file, blank=True,
                                 null=False)
    pre_path = models.CharField(max_length=200, blank=True, null=False)

    class Meta:
        db_table = 'plants'
        verbose_name = 'Plant'
        verbose_name_plural = 'Plants'

    def __str__(self):
        return self.persian_name

    def __str_to_file__(self):
        return f'(id={self.pk}, persian_name={self.persian_name}, image={self.image}, scientific_name={self.scientific_name},' \
               f' family={self.family}, morphology={self.morphology}, flowering_time={self.flowering_time},' \
               f' geographical_distribution={self.geographical_distribution},' \
               f' ecology={self.ecology}, habitat_characteristics={self.habitat_characteristics}, climate={self.climate},' \
               f' soil_characteristics={self.soil_characteristics}, more_info={self.info_file} ,video_aparat_id={self.video_aparat_id})'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        ext = self.image.name[self.image.name.rfind('.'):]
        if ext != 'JPG' and ext != 'JPEG':
            image = Image.open(self.image.path)
            image = image.convert('RGB')
            os.remove(self.image.path)
            self.image = self.image.name[:self.image.name.rfind('.')] + '.jpg'
            image.save(self.image.path, format='JPEG')
            super().save(update_fields=['image'])
        return self


class Medicine(models.Model):
    property_name = models.CharField(max_length=100, blank=True, null=True, unique=True,
                                     verbose_name=_("Property Name"))

    def __str__(self):
        return self.property_name

    class Meta:
        db_table = 'medicines'
        verbose_name = 'Medicine'
        verbose_name_plural = 'Medicines'


class MedicinalUnit(models.Model):
    plant = models.ForeignKey('Plant', related_name="medicinal_properties", on_delete=models.CASCADE)
    medicine = models.ForeignKey('Medicine', related_name="medicine_unit", on_delete=models.CASCADE)

    class Meta:
        db_table = 'medicinal_unit'
        verbose_name = 'medicinal unit'
        verbose_name_plural = 'medicinal units'
        unique_together = (('plant', 'medicine'),)


def set_sub_image_path(instance, filename):
    string_filename = str(filename)
    ext = string_filename[string_filename.rfind("."):]
    instance_model_name = instance._meta.model.__name__.lower()
    if instance.user.is_superuser:
        return normpath(join(IMAGE_DIR, instance.plant.pre_path, instance_model_name,
                             f'_{instance_model_name}_' + uuid.uuid4().__str__()[0:7] + ext))
    else:
        return normpath(join(IMAGE_DIR, instance.plant.pre_path, 'User_Images', instance_model_name, '_' +
                             instance.user.username + f'_{instance_model_name}_' + uuid.uuid4().__str__()[
                                                                                   0:7] + ext))


def save_compress_image(instance):
    with Image.open(instance.image.path) as image:
        guess = 70
        low = 1
        high = 100
        size = 1024 * 1024 * 1.25
        if image.format != 'JPG' and image.format != 'JPEG':
            image = image.convert('RGB')
            os.remove(instance.image.path)
            instance.image = instance.image.name[:instance.image.name.rfind('.')] + '.jpg'

        while low < high:
            image.save(instance.image.path, format='JPEG', optimize=True,
                       quality=guess)
            if instance.image.size < size:
                low = guess
            else:
                high = guess - 1
            guess = (low + high + 1) // 2
    return instance


class Leaf(models.Model):
    image = models.ImageField(blank=False, null=False, upload_to=set_sub_image_path)
    plant = models.ForeignKey('Plant', related_name="leaf_image_set", on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name="user_leaf_image_set",
                             default=None, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'leaf_images'
        verbose_name = 'leaf'
        verbose_name_plural = 'leafs'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        save_compress_image(self)
        super().save(update_fields=['image'])


class Stem(models.Model):
    image = models.ImageField(blank=False, null=False, upload_to=set_sub_image_path)
    plant = models.ForeignKey('Plant', related_name="stem_image_set", on_delete=models.CASCADE)
    user = models.ForeignKey(User, default=None,
                             related_name="user_stem_image_set", on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'stem_image'
        verbose_name = 'stem'
        verbose_name_plural = 'stems'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        save_compress_image(self)
        super().save(update_fields=['image'])


class Flower(models.Model):
    image = models.ImageField(blank=False, null=False, upload_to=set_sub_image_path)
    plant = models.ForeignKey('Plant', related_name="flower_image_set", on_delete=models.CASCADE)
    user = models.ForeignKey(User, default=None,
                             related_name="user_flower_image_set", on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'flower_images'
        verbose_name = 'flower'
        verbose_name_plural = 'flowers'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        save_compress_image(self)
        super().save(update_fields=['image'])


class Habitat(models.Model):
    image = models.ImageField(blank=False, null=False, upload_to=set_sub_image_path)
    plant = models.ForeignKey('Plant', related_name="habitat_image_set", on_delete=models.CASCADE)
    user = models.ForeignKey(User, default=None,
                             related_name="user_habitat_image_set", on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'habitat_images'
        verbose_name = 'habitat'
        verbose_name_plural = 'habitats'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        save_compress_image(self)
        super().save(update_fields=['image'])


class Fruit(models.Model):
    image = models.ImageField(blank=False, null=False, upload_to=set_sub_image_path)
    plant = models.ForeignKey('Plant', related_name="fruit_image_set", on_delete=models.CASCADE)
    user = models.ForeignKey(User, default=None,
                             related_name="user_fruit_image_set", on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'fruit_images'
        verbose_name = 'fruit'
        verbose_name_plural = 'fruits'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        save_compress_image(self)
        super().save(update_fields=['image'])
