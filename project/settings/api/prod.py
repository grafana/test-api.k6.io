from .._base import *

DEBUG = True


# TODO: switch to RDS when it's up and running
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
    # 'default': {
    #     'ENGINE': 'django.db.backends.postgresql',
    #     'NAME': 'postgres',
    #     'USER': 'postgres',
    #     'HOST': 'test_api_db',
    #     'PORT': 5432,
    # }
}

ROOT_URLCONF = 'urls.prod'
