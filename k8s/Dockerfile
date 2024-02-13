FROM python:3.9-alpine

ENV PYTHONUNBUFFERED 1

RUN adduser -u 82 -D -S -G www-data appuser

RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
    nginx \
    musl-dev \
    cargo \
    gcc \
    openssl-dev \
    libexpat \
    libffi-dev \
    build-base \
    mysql-dev \
    mariadb-connector-c-dev && \
    rm -r /usr/local/lib/python*/ensurepip && \
    pip3 install --upgrade pip==23.3 && \
    rm -r /root/.cache

COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

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
