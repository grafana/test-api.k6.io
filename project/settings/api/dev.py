from django_secrets import AwsSecrets
from .._base import *

secrets = AwsSecrets(
    secrets_root='develop/test_api/',
    aws_access_key_id='',
    aws_secret_access_key='',
    region_name="us-east-1"
)

DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(WORK_DIR, 'db.sqlite3'),
    },
}

SECRET_KEY = 'secret'
ROOT_URLCONF = 'urls.dev'
