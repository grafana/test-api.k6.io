# test-api.k6.io

This is a simple API project that is a good target for load testing. 
It contains several authentication mechanisms, private and public endpoints, etc. 

### development 

```bash
cd test-api.k6.io
pyvenv3 .venv
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

## Browseable API

Nice feature of this project is that APIs are "browseable", and can be easily explored by developers via the web interface.

Explore this by clicking on one of the endpoints, for example [/public/crocodiles/](http://test-api.loadimpact.com/public/crocodiles)
and login (top right corner) with one of the default users.
