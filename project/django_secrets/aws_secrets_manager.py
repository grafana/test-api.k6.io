import json
from typing import Sequence, Union, Dict, Optional

import boto3.session


class CredentialsNotFound(Exception):
    def __str__(self):
        return 'AWS credentials not found'


class AwsSecrets:
    """
    AWS SecretsManager
    """

    def __init__(self,
                 secrets_root='',
                 aws_access_key_id=None,
                 aws_secret_access_key=None,
                 profile_name=None,
                 region_name=None):

        self.secrets_root = secrets_root
        self.region_name = region_name
        self.profile_name = profile_name
        self.aws_secret_access_key = aws_secret_access_key
        self.aws_access_key_id = aws_access_key_id
        self._secrets = {}

    def get_client(self):
        credentials = {}
        if self.aws_access_key_id and self.aws_secret_access_key:
            credentials['aws_access_key_id'] = self.aws_access_key_id
            credentials['aws_secret_access_key'] = self.aws_secret_access_key
        elif self.profile_name:
            credentials['profile_name'] = self.profile_name
        credentials['region_name'] = self.region_name
        session = boto3.session.Session(**credentials)

        if session.get_credentials() is None:
            raise CredentialsNotFound()
        return session.client('secretsmanager')

    def get_secret(self,
                   secret_name: str,
                   section: Optional[str] = None) -> Union[Sequence, Dict, str]:
        """
        Search for Secret with nested JSON structure and return a specific section
         Use ':'to separate nested steps when searching
        :param secret_name: Secret name you stored in AWS Secrets Manager
        :param section: JSON object key of the section to find. Nested structures are separated by ':'
            ex) Secret's JSON Structure:
                    {
                        "projects": {
                            "django": {
                                "lhy": {
                                    "SECRET_KEY": "..."
                                }
                            }
                        }
                    }

                section: 'projects:django:lhy'
                 > This section string represents the 'lhy' object
        :return: dict or list
        """

        secret_id = f'{self.secrets_root}{secret_name}'
        if secret_id not in self._secrets:
            client = self.get_client()
            self._secrets[secret_name] = json.loads(client.get_secret_value(SecretId=secret_id)['SecretString'])

        secret = self._secrets[secret_name]

        # if no section is given, returns the entire Secret
        if not section:
            return secret
        for section_key in section.split(':'):
            secret = secret[section_key]
        return secret
