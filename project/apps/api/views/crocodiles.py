from rest_framework import mixins, viewsets
from rest_framework.exceptions import ValidationError

from rest_framework.permissions import IsAuthenticated

from apps.api.models.crocodiles import Crocodile
from apps.api.serializers.crocodiles import CrocodileSerializer


class MyCrocodilesViewSet(mixins.ListModelMixin,
                          mixins.RetrieveModelMixin,
                          mixins.CreateModelMixin,
                          mixins.UpdateModelMixin,
                          mixins.DestroyModelMixin,
                          viewsets.GenericViewSet):
    """
    Crocs belonging to the authenticated user
    """
    serializer_class = CrocodileSerializer
    permission_classes = [IsAuthenticated]

    MAX_CROC_LIMIT = 100

    def get_queryset(self):
        return Crocodile.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        """
        User can have only up to 100 crocodiles on a single account.
        This is here to prevent abuse (overloading of the database with loadtests)
        """
        if Crocodile.objects.filter(owner=self.request.user).count() > self.MAX_CROC_LIMIT:
            raise ValidationError("Error: you can have up to {} "
                                  "crocodiles on your account. "
                                  "You have already reached the limit.".format(self.MAX_CROC_LIMIT))

        serializer.save(owner=self.request.user)


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


