<p align="center"><a href="https://k6.io/"><img src="static_resources/logo.svg" alt="k6" width="220" height="213" /></a></p>

<h3 align="center">test-api.k6.io</h3>
<p align="center">Simple REST API project that is a good target for experimental load testing.</p>

<br/>
<img src="static_resources/github-hr.png" alt="---" />
<br/>

It contains several authentication mechanisms, private and public endpoints, etc. 

# development 

## Prerequisites

```bash
sudo apt install libmysqlclient-dev  # debian/ubuntu
pip install wheel
```

## Setting up your local development environment

```bash
cd test-api.k6.io
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
./project/manage.py runserver
```

### Load initial data
We have a fixture with initial data that populated the prod/dev database with some users and crocodiles.
This generally is run automatically via docker-compose.

```sh
cd test_api
./devops/loaddata.sh
```

### Browseable API

Nice feature of this project is that APIs are "browseable", and can be easily explored by developers via the web interface.

Explore this by clicking on one of the endpoints, for example [/public/crocodiles/](http://test-api.k6.io/public/crocodiles)
and login (top right corner) with one of the default users.
