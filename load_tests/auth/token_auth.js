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
    let loginRes = http.post(`${BASE_URL}/auth/token/login/`, { username: 'user', password: 'test123!'});

    check(loginRes, {
        "login successful": (r) => r.status === 200,
    }) || fail("could not log in");

    let authToken = loginRes.json('access');


    let LoginCheck = check(authToken, {
        "got auth token": (authToken) => authToken !== '',  // token not false-y
    });

    let params = {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    };

    let crocsRes = http.get(`${BASE_URL}/my/crocodiles/`, params);

    console.log(crocsRes.body);

    check(crocsRes, {
        "got crocs": (r) => r.status === 200,
    }) || fail("could not get crocs");

    sleep(1);
}