#!/usr/bin/env bash

# run this from the test_api directory

./project/manage.py dumpdata --indent=4 --exclude=contenttypes --exclude=auth.permission --exclude=admin.logentry --exclude=sessions > fixtures/initial.json
