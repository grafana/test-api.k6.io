import http from "k6/http";
import jsonpath from "jslib.k6.io/jsonpath/1.0.2/index.js";

import { check, group, sleep, fail } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";

export let options = {
    duration: '1m',
    vus: 5,
};

let BASE_URL = 'http://127.0.0.1:8000';


export default function() {
    let loginRes = http.post(`${BASE_URL}/auth/cookie/login/`, { username: 'user', password: 'test123!'});

    check(loginRes, {
        "login successful": (r) => r.status === 200,
    }) || fail("could not log in");

    let LoginCheck = check(loginRes, {
        "user email is correct": (r) => jsonpath.value(r.json(), 'email') === 'user@example.com',
    });

    let crocsRes = http.get(`${BASE_URL}/crocodiles/`);

    check(crocsRes, {
        "got crocs": (r) => r.status === 200,
    }) || fail("could not get crocs");

    // crocsRes.json().forEach((croc)=> console.log(jsonpath.value(croc, 'name')));

    http.post(`${BASE_URL}/auth/cookie/logout/`, { username: 'user', password: 'test123!'});

    sleep(1);
}