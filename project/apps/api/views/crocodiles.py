from rest_framework import mixins, viewsets

from rest_framework.permissions import IsAuthenticated

from apps.api.models.crocodiles import Crocodile
from apps.api.serializers.crocodiles import CrocodileSerializer


class MyCrocodilesViewSet(mixins.ListModelMixin,
                          mixins.RetrieveModelMixin,
                          mixins.CreateModelMixin,
                          viewsets.GenericViewSet):
    """
    Crocs belonging to the authenticated user
    """
    queryset = Crocodile.objects.all()
    serializer_class = CrocodileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Crocodile.objects.filter(owner=self.request.user)


class PublicCrocodilesViewSet(viewsets.GenericViewSet,
                              mixins.ListModelMixin,
                              mixins.RetrieveModelMixin):
    """
    Crocs without an owner are considered public.
    """
    queryset = Crocodile.objects.all()
    serializer_class = CrocodileSerializer
    authentication_classes = []  # authentication not required
    permission_classes = []

    def get_queryset(self):
        return Crocodile.objects.filter(owner__isnull=True)


