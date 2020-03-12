import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

from django_secrets import AwsSecrets

from .._base import *

secrets = AwsSecrets()

DEBUG = False

SECRET_KEY = secrets.get_secret('staging/test-api/django_secret_key', 'SECRET_KEY')

sentry_sdk.init(
    dsn=secrets.get_secret('staging/test-api/sentry', 'dsn'),
    integrations=[DjangoIntegration()]
)

DATABASES = {
    'default': secrets.get_secret('staging/test-api/django-database')
}

ROOT_URLCONF = 'urls.staging'
