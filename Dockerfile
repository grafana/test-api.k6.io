FROM python:3.12-alpine

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
    mariadb-connector-c-dev

ENV PYTHONUNBUFFERED=1
ENV POETRY_VERSION=1.8.2
ENV POETRY_HOME="/opt/poetry"
ENV PATH=$POETRY_HOME:$PATH

RUN python3 -m venv $POETRY_HOME && \
    $POETRY_HOME/bin/pip install pip setuptools -U && \
    $POETRY_HOME/bin/pip install poetry==$POETRY_VERSION

USER appuser

WORKDIR /app

COPY pyproject.toml poetry.lock .
RUN $POETRY_HOME/bin/poetry install

COPY ./project ./project
COPY ./static_resources ./static_resources

WORKDIR /app/project

CMD ["/opt/poetry/bin/poetry", "run", "uvicorn", "--host", "0.0.0.0", "--port", "8000", "base.wsgi:application"]
