upstream test_api {
    server unix:/var/lib/uwsgi/uwsgi_test_api.sock;
}

server {
    listen 80 default_server;
    charset utf-8;
    client_max_body_size 10M;

    location /static {
        alias /srv/test-api.k6.io/workdir/static_root/;
        access_log off;
    }

    location /ws/ {
        proxy_pass http://localhost:8001; # daphne (ASGI) listening on port 8001
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location / {
        uwsgi_pass test_api;

        uwsgi_param   Host                 $host;
        uwsgi_param   X-Real-IP            $remote_addr;
        uwsgi_param   X-Forwarded-For      $proxy_add_x_forwarded_for;
        uwsgi_param   X-Forwarded-Proto    $http_x_forwarded_proto;

        include /srv/test-api.k6.io/devops/conf/uwsgi/uwsgi.params;
    }
}
