from django_secrets import AwsSecrets

from .._base import *

secret = AwsSecrets(secrets_root='staging/test-api-k6-io/',
                    region_name='eu-west-1').get_secret

DEBUG = False

SECRET_KEY = secret('django_secret_key', 'SECRET_KEY')

DATABASES = {
    'default': secret('django_database')
}

ROOT_URLCONF = 'urls.staging'
