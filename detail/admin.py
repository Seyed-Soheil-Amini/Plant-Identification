from django.contrib import admin

from .models import Plant, Image, Video


class ImageInlineAdmin(admin.StackedInline):
    model = Image
    extra = 0


class VideoInlineAdmin(admin.StackedInline):
    model = Video
    extra = 0


@admin.register(Plant)
class PlantAdmin(admin.ModelAdmin):
    list_display = ['name', 'english_name', 'scientific_name', 'family']
    list_filter = ['name', 'scientific_name']
    list_editable = ['english_name', 'scientific_name', 'family']
    search_fields = ('name', 'english_name', 'family', 'scientific_name', 'morphology')
    inlines = [ImageInlineAdmin, VideoInlineAdmin]
