import http from "k6/http";

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


function randomString(anysize) {
  let charset = "abcdefghijklmnopqrstuvwxyz";
  let res = '';
  while (anysize--) res += charset[Math.random() * charset.length | 0];
  return res;
}

let USERNAME = `${randomString(10)}@example.com`;
let PASSWORD = "superCroc2019";
let BASE_URL = 'http://127.0.0.1:8000';

export default () => {

  if(__ITER === 0){
    let createResp = http.post(`${BASE_URL}/user/register/`, {
      first_name: "Crocodile",
      last_name: "Owner",
      username: USERNAME,
      password: PASSWORD,
    });

    check(createResp, {
        "created user": (r) => r.status === 201,
    }) || fail(`could not register. Error: ${createResp.body} `);
  }

  let loginRes = http.post(`${BASE_URL}/auth/token/login/`,
    { username: USERNAME, password: PASSWORD});

  let authToken = loginRes.json('access');

  check(authToken, {
      "logged in successfully": (authToken) => authToken !== '',
  });

  let authHeaders = {
      headers: {
          Authorization: `Bearer ${authToken}`
      }
  };

  let newCroc = {
    name: `Name ${randomString(10)}`,
    sex: "M",
    date_of_birth: "2001-01-01",
  };
  let createR = http.post(`${BASE_URL}/my/crocodiles/`, newCroc, authHeaders);

  check(createR, {
    "croc created": (r) => r.status === 201,
  }) || fail(`Unable to create croc ${createR.status} ${createR.body}`);

  console.log(createR.body);

  let putR = http.patch(`${BASE_URL}/my/crocodiles/${createR.json('id')}/`, {name: "new name"}, authHeaders);

  check(putR, {
    "resp correct": (r) => r.status === 200,
    "croc updated": (r) => r.json('name') === "new name",
  }) || fail(`Unable to update the croc ${createR.status} ${createR.body}`);

  let deleteR = http.del(`${BASE_URL}/my/crocodiles/${createR.json('id')}/`, {}, authHeaders);
  let getR = http.get(`${BASE_URL}/my/crocodiles/${createR.json('id')}/`, authHeaders);

  check(deleteR, {
    "crocDeleted": () => deleteR.status === 204,
    "crocNotFound": () => getR.status === 404,
  }) || fail(`Croc was not deleted properly`);

  sleep(1);
}