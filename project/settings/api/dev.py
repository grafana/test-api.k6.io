from .._base import *

DEBUG = True


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(WORK_DIR, 'db.sqlite3'),
    }
}

ROOT_URLCONF = 'urls.dev'
