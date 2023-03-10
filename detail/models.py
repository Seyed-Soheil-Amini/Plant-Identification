from django.db import models


class Plant(models.Model):
    image = models.ImageField(upload_to='mainImages/', null=True, blank=True)
    name = models.CharField(max_length=100)
    english_name = models.CharField(max_length=100, null=True, blank=True)
    scientific_name = models.CharField(max_length=100, null=True, blank=True)
    family = models.CharField(max_length=100, null=True, blank=True)
    morphology = models.TextField(null=True, blank=True)
    water_need = models.CharField(max_length=100, null=True, blank=True)
    soil_need = models.CharField(max_length=100, null=True, blank=True)
    salinity_tolerance = models.CharField(max_length=100, null=True, blank=True)
    temperature_tolerance = models.CharField(max_length=100, null=True, blank=True)
    species_score = models.CharField(max_length=100, null=True, blank=True)
    first_planting_priority = models.CharField(max_length=100, null=True, blank=True)
    second_planting_priority = models.CharField(max_length=100, null=True, blank=True)
    third_planting_priority = models.CharField(max_length=100, null=True, blank=True)
    suitable_planting_location = models.CharField(max_length=100, null=True, blank=True)
    suitable_planting_combination = models.CharField(max_length=100, null=True, blank=True)
    specific_characteristic = models.CharField(max_length=100, null=True, blank=True)
    more_information = models.TextField(blank=True, null=True)
    references = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'plants'
        verbose_name = 'Plant'
        verbose_name_plural = 'Plants'

    def __str__(self):
        return self.name
