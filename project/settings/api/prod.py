import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

from .._base import *

DEBUG = False

sentry_sdk.init(
    dsn="https://a8eb61375aaa4770a1d218fddfeeadc0@sentry.io/1497944",
    integrations=[DjangoIntegration()]
)


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get("MYSQL_DATABASE", '==missing=='),
        'PASSWORD': os.environ.get("MYSQL_PASSWORD", '==missing=='),
        'USER': os.environ.get("MYSQL_USER", '==missing=='),
        'HOST': os.environ.get("MYSQL_HOST", '==missing=='),
        'PORT': os.environ.get("MYSQL_PORT", 3306),
    }
}

ROOT_URLCONF = 'urls.prod'
