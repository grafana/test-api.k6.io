FROM python:3.9.5-alpine

EXPOSE 80
ENV PYTHONUNBUFFERED 1

RUN addgroup -g 82 -S www-data && adduser -u 82 -D -S -G www-data www-data
RUN mkdir -p /var/lib/uwsgi /var/log/uwsgi && chown www-data /var/lib/uwsgi /var/log/uwsgi

COPY requirements.txt /srv/test-api.k6.io/requirements.txt

WORKDIR /srv/test-api.k6.io/

RUN apk add --no-cache \
    nginx \
    uwsgi \
    uwsgi-python3 \
    musl-dev \
    cargo \
    openssl-dev \
    libffi-dev \
    supervisor \
    build-base \
    mysql-client \
    mariadb-connector-c-dev && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --upgrade pip && \
    pip3 install -r /srv/test-api.k6.io/requirements.txt && \
    rm /etc/nginx/conf.d/default.conf && \
    rm -r /root/.cache

# Copy the Nginx configs
COPY devops/conf/nginx/nginx.conf /etc/nginx/nginx.conf
COPY devops/conf/nginx/test-api.k6.io /etc/nginx/sites-enabled/test-api.k6.io

# Custom Supervisord config
COPY devops/conf/supervisord/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Add source code
COPY . /srv/test-api.k6.io/

# Collect static files
RUN python project/manage.py collectstatic --noinput -v1

# Add ecs environment variable for non-root processes
RUN echo 'export $(strings /proc/1/environ | grep AWS_CONTAINER_CREDENTIALS_RELATIVE_URI)' >> /root/.profile
RUN echo 'export $(strings /proc/1/environ | grep AWS_CONTAINER_CREDENTIALS_RELATIVE_URI)' >> /home/www-data/.profile

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]