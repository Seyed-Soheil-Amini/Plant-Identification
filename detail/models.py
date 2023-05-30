from django.db import models

from django.utils.translation import gettext_lazy as _

from Plant_Identification import settings

IMAGE_DIR = 'mainImages/'


# def get_file_path(instance, filename):
#     return '{0}/{1}'.format(instance.id, filename)

def set_model_path(instance, filename):
    return IMAGE_DIR + '{0}/{1}'.format(instance.scientific_name, filename)


class Plant(models.Model):
    persian_name = models.CharField(max_length=100, blank=False, null=True, verbose_name=_("Persian Name"))
    image = models.ImageField(upload_to=set_model_path, null=True, blank=True, verbose_name=_("Image"))
    scientific_name = models.CharField(max_length=100, blank=False, null=True, verbose_name=_("scientific Name"))
    family = models.CharField(max_length=100, blank=False, null=True, verbose_name=_("Family"))
    morphology = models.TextField(blank=False, null=True, verbose_name=_("Morphology"))
    flowering_time = models.CharField(max_length=200, blank=False, null=True, verbose_name=_("flowering Time"))
    geographical_distribution = models.CharField(max_length=200, blank=False, null=True,
                                                 verbose_name=_("Geographical Distribution"))
    ecology = models.CharField(max_length=300, blank=False, null=True, verbose_name=_("Ecology"))
    medicinal_properties = models.CharField(max_length=100, blank=False, null=True,
                                            verbose_name=_("Medicinal Properties"))
    habitat_characteristics = models.CharField(max_length=200, blank=False, null=True, verbose_name=_("Habitat"))
    climate = models.CharField(max_length=200, blank=False, null=True, verbose_name=_("Climate"))
    soil_characteristics = models.CharField(max_length=200, blank=False, null=True,
                                            verbose_name=_("Soil Characteristics"))
    more_info = models.TextField(blank=True, null=True, verbose_name=_("More Information"))

    class Meta:
        db_table = 'plants'
        verbose_name = 'Plant'
        verbose_name_plural = 'Plants'

    def __str__(self):
        return self.persian_name


def set_leaf_image_path(instance, filename):
    return IMAGE_DIR + '{0}/{1}/{2}'.format(instance.plant.scientific_name, 'leaf', filename)


class Leaf(models.Model):
    image = models.ImageField(blank=False,null=False, upload_to=set_leaf_image_path)
    plant = models.ForeignKey('Plant', related_name="leaf_image_set", on_delete=models.CASCADE)

    class Meta:
        db_table = 'leaf_images'
        verbose_name = 'leaf'
        verbose_name_plural = 'leafs'


def set_stem_image_path(instance, filename):
    return IMAGE_DIR + '{0}/{1}/{2}'.format(instance.plant.scientific_name, 'stem', filename)


class Stem(models.Model):
    image = models.ImageField(blank=False,null=False, upload_to=set_stem_image_path)
    plant = models.ForeignKey('Plant', related_name="stem_image_set", on_delete=models.CASCADE)

    class Meta:
        db_table = 'stem_image'
        verbose_name = 'stem'
        verbose_name_plural = 'stems'


def set_flower_image_path(instance, filename):
    return IMAGE_DIR + '{0}/{1}/{2}'.format(instance.plant.scientific_name, 'flower', filename)


class Flower(models.Model):
    image = models.ImageField(blank=False, null=False, upload_to=set_flower_image_path)
    plant = models.ForeignKey('Plant', related_name="flower_image_set", on_delete=models.CASCADE)

    class Meta:
        db_table = 'flower_images'
        verbose_name = 'flower'
        verbose_name_plural = 'flowers'
