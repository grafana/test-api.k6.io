from os import environ

env = environ.get("ENVIRONMENT_NAME")
if env == "dev":
    from .dev import *
elif env == "k8s":
    # In k8s setup settings come from env vars, specified in the Deployment api object and
    # configured in k8s ConfigMap or ExternalSecret api objects.
    # Quering secrets from AWS Secret Manager is the responsibility of the k8s cluster.
    from .k8s import *
elif not env:
    from .default import *
else:
    raise Exception(f"ENVIRONMENT_NAME env incorrect: {env}")
