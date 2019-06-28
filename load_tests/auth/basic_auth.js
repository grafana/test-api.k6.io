import http from "k6/http";

import { check, group, sleep, fail } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";
import encoding from "k6/encoding";

export let options = {
    duration: '1m',
    vus: 5,
};

let BASE_URL = 'http://127.0.0.1:8000';
let USERNAME = 'user';
let PASSWORD = 'test123!';

let authHeaders = {
    headers: {
        "Authorization": "Basic " + encoding.b64encode(`${USERNAME}:${PASSWORD}`)
    }
};

export default function() {

    let crocsRes = http.get(`${BASE_URL}/crocodiles/`, authHeaders);


    check(crocsRes, {
        "got crocs": (r) => r.status === 200,
    }) || fail("could not get crocs");

    console.log(crocsRes.body);

    sleep(1);
}