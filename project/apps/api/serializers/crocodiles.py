from rest_framework import serializers

from apps.api.models.crocodiles import Crocodile


class CrocodileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crocodile
        fields = ['id', 'name', 'sex', 'date_of_birth', 'age']

