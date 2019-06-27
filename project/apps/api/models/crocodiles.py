import datetime
from dateutil.relativedelta import relativedelta

from django.db import models


class Crocodile(models.Model):
    CROC_SEX = (
        ('M', 'Male'),
        ('F', 'Female'),
    )

    name = models.CharField(max_length=255)
    sex = models.CharField(choices=CROC_SEX, max_length=1)
    date_of_birth = models.DateField()

    @property
    def age(self):
        return relativedelta(datetime.date.today(), self.date_of_birth).years

