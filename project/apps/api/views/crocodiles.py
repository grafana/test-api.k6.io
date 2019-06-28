from django.views.decorators.csrf import csrf_exempt
from rest_framework import mixins, viewsets

# from api.models.crocodiles import Crocodile
from rest_framework.permissions import IsAuthenticated

from apps.api.models.crocodiles import Crocodile
from apps.api.serializers.crocodiles import CrocodileSerializer


class CrocodileViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin):
    queryset = Crocodile.objects.all()
    serializer_class = CrocodileSerializer
    # authentication_classes = []
    permission_classes = [IsAuthenticated]
