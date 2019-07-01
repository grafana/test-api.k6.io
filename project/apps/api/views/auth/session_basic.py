from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from rest_framework import serializers, response, permissions
from rest_framework.views import APIView

from apps.api.serializers.login import LoginSerializer


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name',
                  'email', 'date_joined')


class LogoutView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        logout(request)
        return response.Response()


class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return response.Response(UserSerializer(user).data)

