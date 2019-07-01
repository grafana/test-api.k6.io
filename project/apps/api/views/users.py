from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny

from apps.api.serializers.users import UserSerializer


class UserCreateAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

