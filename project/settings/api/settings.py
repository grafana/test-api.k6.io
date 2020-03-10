from os import environ

env = environ.get("LOADIMPACT_ENVIRONMENT")
if env == 'dev':
    from .dev import *
elif env == 'prod':
    from .prod import *
elif env == 'staging':
    from .staging import *
else:
    raise Exception(f'LOADIMPACT_ENVIRONMENT env var missing or incorrect: {env}')
