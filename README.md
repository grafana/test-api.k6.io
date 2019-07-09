# test-api.loadimpact.com

This project includes all kinds of APIs, authentication mechanisms, endpoints and whatever 
production-like application examples we need.


### Load initial data
We have a fixture with initial data that populated the prod/dev database with some users and crocodiles.
This generally is run automatically via docker-compose.

```sh
cd test_api
./devops/loaddata.sh
```

### Admin access

You can create/edit the existing objects using admin interface. We have a default admin provisioned by the data fixture.

http://test-api.loadimpact.com/admin

    username: admin
    password: crocodil3


## Browseable API

Nice feature of this project is that APIs are "browseable", and can be easily explored by developers via the web interface.

Explore this by clicking on one of the endpoints, for example [/public/crocodiles/](http://test-api.loadimpact.com/public/crocodiles)
and login (top right corner) with one of the default users.
