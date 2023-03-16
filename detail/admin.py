from django.contrib import admin

from .models import Plant


@admin.register(Plant)
class PlantAdmin(admin.ModelAdmin):
    list_display = ['name', 'english_name', 'scientific_name', 'family', 'morphology']
    list_filter = ['name','scientific_name']
    list_editable = ['english_name','scientific_name','family']
    search_fields = ('name', 'english_name','family','scientific_name','morphology')
# class PlantAdmin(admin.ModelAdmin):
#     list_display = ['name', 'english_name', 'scientific_name', 'family', 'morphology']
