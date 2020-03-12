import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

from django_secrets import AwsSecrets

from .._base import *

secrets = AwsSecrets(secrets_root='staging/test-api/',
                     region_name='eu-west-1')

DEBUG = False

SECRET_KEY = secrets.get_secret('django_secret_key', 'SECRET_KEY')

sentry_sdk.init(
    dsn=secrets.get_secret('sentry', 'dsn'),
    integrations=[DjangoIntegration()]
)

DATABASES = {
    'default': secrets.get_secret('django_database')
}

ROOT_URLCONF = 'urls.staging'
