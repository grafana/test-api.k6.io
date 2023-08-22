from .._base import *

DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(WORK_DIR, 'db.sqlite3'),
    },
}

SECRET_KEY = 'secret'
ROOT_URLCONF = 'urls.dev'
