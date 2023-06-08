from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User

from Plant_Identification import settings

import uuid

IMAGE_DIR = 'mainImages/'


# file name can change by name of each plants
def set_model_path(instance, filename):
    string_filename = str(filename)
    ext = string_filename[string_filename.rfind("."):len(string_filename)]
    return IMAGE_DIR + '{0}/{1}'.format(instance.scientific_name, instance.scientific_name + ext)


class Plant(models.Model):
    persian_name = models.CharField(blank=False, max_length=100, unique=True, null=True, verbose_name=_("Persian Name"))
    image = models.ImageField(upload_to=set_model_path, null=True, blank=True, verbose_name=_("Image"))
    scientific_name = models.CharField(blank=False, max_length=100, null=True, unique=True,
                                       verbose_name=_("scientific Name"))
    family = models.TextField(blank=False, null=True, verbose_name=_("Family"))
    morphology = models.TextField(blank=False, null=True, verbose_name=_("Morphology"))
    flowering_time = models.TextField(blank=False, null=True, verbose_name=_("flowering Time"))
    geographical_distribution = models.TextField(blank=False, null=True,
                                                 verbose_name=_("Geographical Distribution"))
    ecology = models.TextField(blank=False, null=True, verbose_name=_("Ecology"))
    habitat_characteristics = models.TextField(blank=False, null=True, verbose_name=_("Habitat"))
    climate = models.TextField(blank=False, null=True, verbose_name=_("Climate"))
    soil_characteristics = models.TextField(blank=False, null=True,
                                            verbose_name=_("Soil Characteristics"))
    more_info = models.TextField(blank=True, null=True, verbose_name=_("More Information"))
    video_iframe_link = models.URLField(null=True, blank=True)
    adder_user = models.ForeignKey(User, null=True, related_name="adding_user", on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'plants'
        verbose_name = 'Plant'
        verbose_name_plural = 'Plants'

    def __str__(self):
        return self.persian_name


class Medicine(models.Model):
    property_name = models.CharField(max_length=100, blank=True, null=True, verbose_name=_("Property Name"))
    def __str__(self):
        return self.property_name

    class Meta:
        db_table = 'medicines'
        verbose_name = 'Medicine'
        verbose_name_plural = 'Medicines'


def set_leaf_image_path(instance, filename):
    string_filename = str(filename)
    ext = string_filename[string_filename.rfind("."):len(string_filename)]
    if instance.user.is_superuser:
        return IMAGE_DIR + '{0}/{1}/{2}'.format(instance.plant.scientific_name, 'leaf',
                                                instance.plant.scientific_name + '_L_' + uuid.uuid4().__str__()[
                                                                                         0:7] + ext)
    else:
        return IMAGE_DIR + '{0}/{1}/{2}/{3}'.format(instance.plant.scientific_name, 'User_Images', 'leaf',
                                                    instance.plant.scientific_name + '_' +
                                                    instance.user.username + '_L_' + uuid.uuid4().__str__()[
                                                                                     0:7] + ext)


class Leaf(models.Model):
    image = models.ImageField(blank=False, null=False, upload_to=set_leaf_image_path)
    plant = models.ForeignKey('Plant', related_name="leaf_image_set", on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name="user_leaf_image_set",
                             default=User.objects.get(username="soheilofficial").id, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'leaf_images'
        verbose_name = 'leaf'
        verbose_name_plural = 'leafs'


def set_stem_image_path(instance, filename):
    string_filename = str(filename)
    ext = string_filename[string_filename.rfind("."):len(string_filename)]
    if instance.user.is_superuser:
        return IMAGE_DIR + '{0}/{1}/{2}'.format(instance.plant.scientific_name, 'stem',
                                                instance.plant.scientific_name + '_S_' + uuid.uuid4().__str__()[
                                                                                         0:7] + ext)
    else:
        return IMAGE_DIR + '{0}/{1}/{2}/{3}'.format(instance.plant.scientific_name, 'User_Images', 'stem',
                                                    instance.plant.scientific_name + '_' +
                                                    instance.user.username + '_S_' + uuid.uuid4().__str__()[
                                                                                     0:7] + ext)


class Stem(models.Model):
    image = models.ImageField(blank=False, null=False, upload_to=set_stem_image_path)
    plant = models.ForeignKey('Plant', related_name="stem_image_set", on_delete=models.CASCADE)
    user = models.ForeignKey(User, default=User.objects.get(username="soheilofficial").id,
                             related_name="user_stem_image_set", on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'stem_image'
        verbose_name = 'stem'
        verbose_name_plural = 'stems'


def set_flower_image_path(instance, filename):
    string_filename = str(filename)
    ext = string_filename[string_filename.rfind("."):len(string_filename)]
    if instance.user.is_superuser:
        return IMAGE_DIR + '{0}/{1}/{2}'.format(instance.plant.scientific_name, 'flower',
                                                instance.plant.scientific_name + '_F_' + uuid.uuid4().__str__()[
                                                                                         0:7] + ext)
    else:
        return IMAGE_DIR + '{0}/{1}/{2}/{3}'.format(instance.plant.scientific_name, 'User_Image', 'flower',
                                                    instance.plant.scientific_name + '_' +
                                                    instance.user.username + '_F_' + uuid.uuid4().__str__()[
                                                                                     0:7] + ext)


class Flower(models.Model):
    image = models.ImageField(blank=False, null=False, upload_to=set_flower_image_path)
    plant = models.ForeignKey('Plant', related_name="flower_image_set", on_delete=models.CASCADE)
    user = models.ForeignKey(User, default=User.objects.get(username="soheilofficial").id,
                             related_name="user_flower_image_set", on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'flower_images'
        verbose_name = 'flower'
        verbose_name_plural = 'flowers'


class MedicinalUnit(models.Model):
    plant = models.ForeignKey('Plant', related_name="medicinal_properties", on_delete=models.CASCADE)
    medicine = models.ForeignKey('Medicine', related_name="medicine_unit", on_delete=models.CASCADE)

    class Meta:
        db_table = 'medicinal_unit'
        verbose_name = 'medicinal unit'
        verbose_name_plural = 'medicinal units'
