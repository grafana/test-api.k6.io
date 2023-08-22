from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.exceptions import ValidationError


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password')

    def create(self, validated_data):
        user = super(UserSerializer, self).create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

    def validate_email(self, email):
        if User.objects.filter(email=email).count() > 0:
            raise ValidationError("User with this email already exists!")
        return email

    def validate_username(self, username):
        if User.objects.filter(username=username).count() > 0:
            raise ValidationError("User with this username already exists!")
        return username