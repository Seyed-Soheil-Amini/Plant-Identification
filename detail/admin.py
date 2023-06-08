from django.contrib import admin

from .models import Plant, Leaf, Stem, Flower, Medicine, MedicinalUnit


class MedicineAdmin(admin.ModelAdmin):
    list_display = ['property_name']
    list_filter = ['property_name']


class LeafAdmin(admin.StackedInline):
    model = Leaf
    fields = ['image']
    extra = 0


#
# # @admin.register(Stem)
class StemAdmin(admin.StackedInline):
    model = Stem
    fields = ['image']
    extra = 0


# #
# #
# # @admin.register(Flower)
class FlowerAdmin(admin.StackedInline):
    model = Flower
    fields = ['image']
    extra = 0


class MedicineUnitAdmin(admin.StackedInline):
    model = MedicinalUnit
    fields = ['medicine']
    extra = 0


# @admin.register(Plant)
class PlantAdmin(admin.ModelAdmin):
    list_display = ['persian_name', 'scientific_name', 'family']
    list_filter = ['persian_name', 'scientific_name']
    list_editable = ['scientific_name', 'family']
    search_fields = ('persian_name', 'family', 'scientific_name', 'morphology')
    inlines = [MedicineUnitAdmin, LeafAdmin, StemAdmin, FlowerAdmin]


admin.site.register(Plant, PlantAdmin)
admin.site.register(Medicine,MedicineAdmin)
