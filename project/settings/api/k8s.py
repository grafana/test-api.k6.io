from .._base import *
from os import environ

DEBUG = environ.get('DEBUG', 'False').lower() in ('true', '1')

SECRET_KEY = environ.get("DJANGO_SECRET_KEY", "")

DATABASES = {
    'default': {
        'ENGINE': environ.get('DB_ENGINE'),
        'NAME': environ.get('DB_NAME'),
        'USER':  environ.get('DB_USER'),
        'PASSWORD':  environ.get('DB_PASSWORD'),
        'HOST':  environ.get('DB_HOST'),
        'PORT':  environ.get('DB_PORT')
    }
}

ROOT_URLCONF = environ.get('ROOT_URLCONF')