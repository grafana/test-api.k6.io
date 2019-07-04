from .._base import *

DEBUG = True


DATABASES = {
    # 'default': {
    #     'ENGINE': 'django.db.backends.sqlite3',
    #     'NAME': os.path.join(WORK_DIR, 'db.sqlite3'),
    # },
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'HOST': 'test_api_db',
        'PORT': 5432,
    }
}

ROOT_URLCONF = 'urls.dev'
