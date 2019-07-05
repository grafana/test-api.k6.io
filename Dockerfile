FROM python:3.7

EXPOSE 80

ENV PYTHONUNBUFFERED 1

RUN \
  apt update && \
  apt install -y curl git htop man unzip vim wget && \
  apt-get install -y build-essential


# Install nginx and other apt dependencies.
RUN \
    apt-get update && \
    apt-get install -y strace nginx python python-dev python-setuptools python-pip supervisor libpq-dev libpcre3 libpcre3-dev libyaml-dev libmemcached-dev && \
    rm -rf /var/lib/apt/lists/* && \
    chown -R www-data:www-data /var/lib/nginx

RUN pip install uwsgi
RUN mkdir -p /var/lib/uwsgi /var/log/uwsgi && chown www-data /var/lib/uwsgi /var/log/uwsgi

# Setup supervisord
RUN pip install supervisor-stdout
RUN mkdir -p /etc/supervisor/conf.d/

RUN mkdir -p /srv/test-api.loadimpact.com/

WORKDIR /srv/test-api.loadimpact.com/
ADD . /srv/test-api.loadimpact.com/

ENV DJANGO_SETTINGS_MODULE=settings.api.prod

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Setup nginx
COPY devops/conf/nginx/nginx.conf /etc/nginx/nginx.conf

# Additional uwsgi, nginx and supervisord setup
RUN \
    rm -f /etc/nginx/sites-enabled/default && \
    mkdir -p /etc/nginx/sites-enabled/ && \
    chown www-data /etc/nginx/sites-enabled/ && \
    ln -s /srv/test-api.loadimpact.com/devops/conf/nginx/test-api.loadimpact.com /etc/nginx/sites-enabled/ && \
    chown www-data /srv/test-api.loadimpact.com/devops/conf/uwsgi && \
    ln -s /srv/test-api.loadimpact.com/devops/conf/supervisord/supervisord.conf /etc/supervisor/conf.d/

# Collect static files
RUN python project/manage.py collectstatic --noinput -v1

#CMD tail -f /dev/null

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
