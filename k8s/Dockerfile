FROM python:3.9-slim-bullseye

RUN apt-get update && apt-get -y upgrade && \
    export DEBIAN_FRONTEND=noninteractive && \
    apt-get -y install --no-install-recommends \
        gcc \
        default-libmysqlclient-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN useradd --uid 1000 --create-home appuser

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

USER appuser

WORKDIR /app

COPY ./project ./project
COPY ./static_resources ./static_resources

WORKDIR /app/project

# Commands

# Default command starts gunicorn serving http requests
CMD ["gunicorn", \
    "--workers=4", \
    "--worker-tmp-dir", "/dev/shm", \
    "--log-file=-", \
    "--bind", "0.0.0.0:8000", \
    "wsgi"]

# Use alternative command to start daphne serving websockets
# CMD ["daphne", "-p", "8000", "--access-log", "-", "--proxy-headers", "asgi:application"]

# Collecting static files command
# WORKDIR /app
# CMD ["python", "project/manage.py", "collectstatic", "--noinput", "-v1"]
