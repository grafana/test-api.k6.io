import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

from django_secrets import AwsSecrets

from .._base import *

secret = AwsSecrets(secrets_root='staging/test-api-loadimpact-com/',
                    region_name='eu-west-1').get_secret

DEBUG = False

SECRET_KEY = secret('django_secret_key', 'SECRET_KEY')

sentry_sdk.init(
    dsn=secret('sentry', 'dsn'),
    integrations=[DjangoIntegration()]
)

DATABASES = {
    'default': secret('django_database')
}

ROOT_URLCONF = 'urls.staging'
