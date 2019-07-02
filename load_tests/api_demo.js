import http from "k6/http";
import jsonpath from "jslib.k6.io/jsonpath/1.0.2/index.js";

import {check, group, sleep, fail} from "k6";
import {Counter, Rate, Trend} from "k6/metrics";

export let options = {
  stages: [
    {target: 200, duration: "1m"},
  ],
  thresholds: {
    "http_req_duration": ["p(95)<500"],
    "http_req_duration{publicEndpoint:yes}": ["p(95)<100"],
    "check_failure_rate": ["rate<0.3"]
  },
};

let BASE_URL = 'http://127.0.0.1:8000';
let USERNAME = 'user';
let PASSWORD = 'test123!';

// var successfulLogins = new Counter("successful_logins");
// var checkFailureRate = new Rate("check_failure_rate");
let timeToFirstByte = new Trend("time_to_first_byte", true);


export default () => {

  group("Public endpoints", () => {
    // call some public endpoints in batch

    let responses = http.batch([
      ["GET", `${BASE_URL}/public/crocodiles/1/`, {}, {tags: {name: "PublicCrocs"}}],
      ["GET", `${BASE_URL}/public/crocodiles/2/`, {}, {tags: {name: "PublicCrocs"}}],
      ["GET", `${BASE_URL}/public/crocodiles/3/`, {}, {tags: {name: "PublicCrocs"}}],
      ["GET", `${BASE_URL}/public/crocodiles/4/`, {}, {tags: {name: "PublicCrocs"}}],
    ]);

    // check that all the crocodiles we fetched have names
    Object.values(responses).map(resp => check(resp, {
      "crocs have names": (resp) => resp.json('name') !== ''
    }))

  });


  group("Login", () => {
    let loginRes = http.post(`${BASE_URL}/auth/cookie/login/`, {
      username: USERNAME,
      password: PASSWORD
    });

    timeToFirstByte.add(loginRes.timings.waiting, {ttfbURL: loginRes.url});

    check(loginRes, {
      "login successful": (r) => r.status === 200,
    }) || fail("could not log in");

    check(loginRes, {
      "user email is correct": (r) => jsonpath.value(r.json(), 'email') === 'user@example.com',
    });

    let crocsRes = http.get(`${BASE_URL}/my/crocodiles/`);

    check(crocsRes, {
      "Retrieved my Crocs": (r) => r.status === 200,
    }) || fail("could not get crocs");
  });

  let newCrocId = null;

  group("Retrieve and modify crocodiles", () => {

    // create new croc
    let newCrocResp = http.post(`${BASE_URL}/my/crocodiles/`, {
      "name": "Curious George",
      "sex": "M",
      "date_of_birth": "1982-03-03",
    }, {tags: {endpointType: "modifyCrocs"}});

    check(newCrocResp, {
      "Croc Created": (r) => r.status === 201,
    }) || fail(`Unable to create croc ${newCrocResp.status} ${newCrocResp.body}`);

    newCrocId = newCrocResp.json('id');

    let updateResp = http.patch(`${BASE_URL}/my/crocodiles/${newCrocId}/`, {name: "New name"}, {tags: {name: 'Croc Operation'}});

    check(updateResp, {
      "update succeeded": (r) => r.status === 200,
      "croc name changed": (r) => r.json('name') === "New name",
    }) || fail(`Unable to update the croc. Status: ${updateResp.status}`);
  });

  group("Delete and verify", () => {
    let deleteCroc = http.del(`${BASE_URL}/my/crocodiles/${newCrocId}/`, null, {tags: {name: 'Croc Operation'}});
    let getCroc = http.get(`${BASE_URL}/my/crocodiles/${newCrocId}/`, {tags: {name: 'Retrieve Deleted Croc'}});

    check(deleteCroc, {
      "Croc Deletion succeeded": () => deleteCroc.status === 204,
      "Croc Not Found": () => getCroc.status === 404,
    }) || fail(`Croc was not deleted properly`);

  });

  group("Log me out!", () => {
    http.post(`${BASE_URL}/auth/cookie/logout/`);

    let getCrocs = http.get(`${BASE_URL}/my/crocodiles/`);

    // console.log(getCrocs.body, getCrocs.status)

    check(getCrocs, {
      "got crocs": (r) => r.status === 401,
    }) || fail("ERROR: I'm still logged in!");

  });


  sleep(1);
}