# The first instruction is what image we want to base our container on
# We Use an official Python runtime as a parent image
FROM python:3.7

EXPOSE 80

ENV PYTHONUNBUFFERED 1

RUN \
  apt update && \
  apt install -y curl git htop man unzip vim wget && \
  apt-get install -y build-essential


RUN mkdir -p /srv/api.test.loadimpact.com/

WORKDIR /srv/api.test.loadimpact.com/
ADD . /srv/api.test.loadimpact.com/

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt


#ENTRYPOINT ["/srv/api.test.loadimpact.com/docker/entrypoint.sh"]
#CMD ./project/manage.py migrate --noinput && ./project/manage.py runserver 0.0.0.0:80
CMD python project/manage.py makemigrations && python project/manage.py migrate && python project/manage.py runserver 0.0.0.0:8000
