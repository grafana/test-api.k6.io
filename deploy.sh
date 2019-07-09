#!/bin/bash
#
# - Check if in circleci
# - set tag name
# - set environment
# - invoke ansible

if [ -z $CIRCLECI ]; then
    echo "This script needs the CircleCI environment variables to run. Exiting..."
    exit 1
fi

# Build a Python distributable and push to gemfury

# Exit on error
set -e 

AWS_ENV=""
AWS_REGION=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""

if [ "$CIRCLE_BRANCH" = "master" ]; then
    export AWS_ENV="production"
    export AWS_REGION="us-east-1"
    export AWS_ACCESS_KEY_ID=$PRODUCTION_ACCESS_KEY_ID
    export AWS_SECRET_ACCESS_KEY=$PRODUCTION_SECRET_ACCESS_KEY
fi

if [ -z $AWS_ACCESS_KEY_ID ] || [ -z $AWS_SECRET_ACCESS_KEY ]; then
    echo "No AWS keys set. Exiting..."
    exit
fi

pip install --upgrade \
    --extra-index-url https://pypi.fury.io/nb4o5eUFa3gxr5AW9rVX/loadimpact/ \
    li_ecs_deploy

deploy -t $CIRCLE_BRANCH-$CIRCLE_BUILD_NUM -e $AWS_ENV -r $AWS_REGION task
deploy -f ecs_deploy_db.yml -t $CIRCLE_BRANCH-$CIRCLE_BUILD_NUM -e $AWS_ENV -r $AWS_REGION task
deploy -t $CIRCLE_BRANCH-$CIRCLE_BUILD_NUM -e $AWS_ENV -r $AWS_REGION --force
