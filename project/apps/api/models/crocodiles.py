import datetime
from dateutil.relativedelta import relativedelta
from django.contrib.auth.models import User

from django.db import models


class Crocodile(models.Model):
    CROC_SEX = (
        ('M', 'Male'),
        ('F', 'Female'),
    )

    name = models.CharField(max_length=255)
    sex = models.CharField(choices=CROC_SEX, max_length=1)
    date_of_birth = models.DateField()
    owner = models.ForeignKey(User, null=True, on_delete=models.CASCADE, blank=True,
                              help_text="Crocs without an owner are considered public")

    @property
    def age(self):
        return relativedelta(datetime.date.today(), self.date_of_birth).years

    def __str__(self):
        return '({}) {}'.format(self.id, self.name)