from django.contrib import admin

from home.models import Plant


@admin.register(Plant)
class PlantAdmin(admin.ModelAdmin):
    list_display = ['name', 'english_name', 'scientific_name', 'family', 'morphology']
