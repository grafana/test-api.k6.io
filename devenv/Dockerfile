FROM python:3.11-alpine

EXPOSE 80
ENV PYTHONUNBUFFERED 1

RUN adduser -u 82 -D -S -G www-data www-data
RUN mkdir -p /var/lib/uwsgi /var/log/uwsgi && chown www-data /var/lib/uwsgi /var/log/uwsgi

COPY requirements.txt /srv/test-api.k6.io/requirements.txt

WORKDIR /srv/test-api.k6.io/

RUN apk add --no-cache \
    nginx \
    musl-dev \
    cargo \
    openssl-dev \
    libffi-dev \
    build-base \
    mariadb-connector-c-dev && \
    rm -r /usr/local/lib/python*/ensurepip && \
    pip3 install --upgrade pip && \
    pip3 install supervisor && \
    pip3 install uwsgi  && \
    pip3 install -r /srv/test-api.k6.io/requirements.txt && \
    rm -r /root/.cache

# Copy the Nginx configs
COPY devenv/conf/nginx/nginx.conf /etc/nginx/nginx.conf
COPY devenv/conf/nginx/test-api.k6.io /etc/nginx/sites-enabled/test-api.k6.io

# Custom Supervisord config
COPY devenv/conf/supervisord/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Add source code
COPY . /srv/test-api.k6.io/

# Collect static files
RUN python project/manage.py collectstatic --noinput -v1

CMD ["/usr/local/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]