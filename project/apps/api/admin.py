from django.contrib import admin

from apps.api.models import Crocodile


@admin.register(Crocodile)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'sex', 'owner', 'age']
