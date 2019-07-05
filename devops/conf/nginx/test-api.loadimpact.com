upstream test_api {
    server unix:/var/lib/uwsgi/uwsgi_test_api.sock;
}

server {
    listen 80 default_server;
    charset utf-8;
    client_max_body_size 10M;

    location /static {
        alias /srv/test-api.loadimpact.com/workdir/static_root/;
        access_log off;
    }

    location / {
        uwsgi_pass test_api;

        uwsgi_param   Host                 $host;
        uwsgi_param   X-Real-IP            $remote_addr;
        uwsgi_param   X-Forwarded-For      $proxy_add_x_forwarded_for;
        uwsgi_param   X-Forwarded-Proto    $http_x_forwarded_proto;

        include /srv/test-api.loadimpact.com/devops/conf/uwsgi/uwsgi.params;
    }
}
