from rest_framework import mixins, viewsets

# from api.models.crocodiles import Crocodile
from apps.api.models.crocodiles import Crocodile
from apps.api.serializers.crocodiles import CrocodileSerializer


class CrocodileViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    queryset = Crocodile.objects.all()
    serializer_class = CrocodileSerializer

    