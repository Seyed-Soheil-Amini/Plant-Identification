from django.db import models


class Plant(models.Model):
    name = models.CharField(max_length=50)
    english_name = models.CharField(max_length=50)
    scientific_name = models.CharField(max_length=50)
    family = models.CharField(max_length=50)
    morphology = models.TextField()
    image = models.ImageField(upload_to='mainImages/')

    class Meta:
        db_table = 'plants'
        verbose_name = 'Plant'
        verbose_name_plural = 'Plants'

    def __str__(self):
        return self.name


