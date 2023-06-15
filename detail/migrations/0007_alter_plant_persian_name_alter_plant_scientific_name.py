# Generated by Django 4.1.7 on 2023-06-12 21:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('detail', '0006_rename_per_path_plant_pre_path'),
    ]

    operations = [
        migrations.AlterField(
            model_name='plant',
            name='persian_name',
            field=models.CharField(max_length=100, unique=True, verbose_name='Persian Name'),
        ),
        migrations.AlterField(
            model_name='plant',
            name='scientific_name',
            field=models.CharField(max_length=100, unique=True, verbose_name='scientific Name'),
        ),
    ]