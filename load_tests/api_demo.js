import http from "k6/http";
import jsonpath from "jslib.k6.io/jsonpath/1.0.2/index.js";

import { check, group, sleep, fail } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";

export let options = {
  stages: [
    { target: 2, duration: "180s" },
  ],
  thresholds: {
    "http_req_duration": ["p(95)<500"],
    "http_req_duration{staticAsset:yes}": ["p(95)<100"],
    "check_failure_rate": ["rate<0.3"]
  },
};

let BASE_URL = 'http://127.0.0.1:8000';
let USERNAME = 'user';
let PASSWORD = 'test123!';

var successfulLogins = new Counter("successful_logins");
var checkFailureRate = new Rate("check_failure_rate");
var timeToFirstByte = new Trend("time_to_first_byte", true);


export default () => {

  group("Public endpoints", () => {

  });


  group("Private endpoints", () => {
    let loginRes = http.post(`${BASE_URL}/auth/cookie/login/`, { username: USERNAME, password: PASSWORD});

    timeToFirstByte.add(loginRes.timings.waiting, { ttfbURL: loginRes.url });

    check(loginRes, {
        "login successful": (r) => r.status === 200,
    }) || fail("could not log in");

    check(loginRes, {
        "user email is correct": (r) => jsonpath.value(r.json(), 'email') === 'user@example.com',
    });

    let crocsRes = http.get(`${BASE_URL}/crocodiles/`);

    check(crocsRes, {
        "got crocs": (r) => r.status === 200,
    }) || fail("could not get crocs");

    crocsRes.json().forEach((croc)=> console.log(jsonpath.value(croc, 'name')));


    let newCroc = http.post(`${BASE_URL}/my/crocodiles/`, {
      "name": "Curious George",
      "sex": "M",
      "date_of_birth": "1982-03-03",}
      );

    


    http.post(`${BASE_URL}/auth/cookie/logout/`, { username: 'user', password: 'test123!'});
  });

  sleep(1);
}