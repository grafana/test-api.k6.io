upstream test_api {
    server unix:/var/lib/uwsgi/uwsgi_test_api.sock;
}

upstream test_api-ws {
    server localhost:8000;
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
        proxy_pass http://test_api-ws;  
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Host $server_name;
    }

    location / {
        uwsgi_pass test_api;

        uwsgi_param   Host                 $host;
        uwsgi_param   X-Real-IP            $remote_addr;
        uwsgi_param   X-Forwarded-For      $proxy_add_x_forwarded_for;
        uwsgi_param   X-Forwarded-Proto    $http_x_forwarded_proto;

        include /srv/test-api.k6.io/devenv/conf/uwsgi/uwsgi.params;
    }
}
