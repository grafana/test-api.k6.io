import {group, sleep, fail, check} from "k6";
import {Trend} from "k6/metrics";

import { authAPI } from "./lib/auth_api.js"
import { crocodilesAPI } from "./lib/crocodiles_api.js"
import { publicAPI } from "./lib/public_api.js"


function randomString(anysize) {
    let charset = "abcdefghijklmnopqrstuvwxyz";
    let res = '';
    while (anysize--) res += charset[Math.random() * charset.length | 0];
    return res;
}


const conf = {
  baseURL: __ENV.BASE_URL || "https://test-api-main.staging.k6.io",
  username: `${randomString(20)}@example.com`,
  password: "secret"
}


export let options = {
  stages: [
    { target: 500, duration: "3m" },
  ],
  thresholds: {
    "http_req_duration": ["p(95)<500"],
    "http_req_duration{publicEndpoint:yes}": ["p(95)<100"],
    "check_failure_rate": ["rate<0.3"]
  },
};

let timeToFirstByte = new Trend("time_to_first_byte", true);


export default function() {
    const { baseURL, username, password } = conf;
    const auth = authAPI(baseURL);
    const crocs = crocodilesAPI(baseURL);
    const pb = publicAPI(baseURL);
    let resp;

    // if(__ITER === 0) {
    //     resp = auth.register({
    //         first_name: "Crocodile",
    //         last_name: "Owner",
    //         username,
    //         password,
    //         email: username,
    //     })
    //     check(resp, auth.registerChecks()) || fail(`could not register. Error: ${resp.body}`);
    // }

    group("Public endpoints", () => {
      resp = pb.crocodiles()
      resp.map((r) => check(r, pb.crocodileChecks()))
    });

    // group("Login", () => {
    //   resp = auth.cookieLogin({ username, password })

    //   check(
    //     resp, auth.cookieLoginChecks(username)
    //   ) || fail("could not log in");
      
    //   timeToFirstByte.add(resp.timings.waiting, {ttfbURL: resp.url});

    //   check(crocs.list(), crocs.listChecks()) || fail("could not get crocs")
    // });

    // let newCrocID;
    // group("Retrieve and modify crocodiles", () => {
    //     // create new croc
    //     resp = crocs.register({
    //       "name": "Curious George",
    //       "sex": "M",
    //       "date_of_birth": "1982-03-03",
    //     }, { tags: { endpointType: "modifyCrocs" }});
    //     check(resp, crocs.registerChecks()) || fail(`Unable to create croc ${resp.status} ${resp.body}`);

    //     newCrocID = resp.json('id')

    //     resp = crocs.rename(newCrocID, "New name", {tags: {name: 'Croc Operation'}})
    //     check(resp, crocs.renameChecks("New name")) || fail(`Unable to update the croc ${resp.status} ${resp.body}`);
    // });

    // group("Delete and verify", () => {
    //     check(
    //       crocs.deregister(newCrocID, {tags: {name: 'Croc Operation'}}), crocs.deregisterChecks()
    //     );

    //     resp = crocs.get(newCrocID, {tags: {name: 'Retrieve Deleted Croc'}});
    //     check(resp, {
    //       "crocNotFound": (r) => r.status === 404,
    //     }) || fail("croc was not deleted properly");
    // });

    // group("Log me out!", () => {
    //     check(auth.cookieLogout(), auth.cookieLogoutChecks())
  
    //     check(crocs.list(), {
    //       "got crocs": (r) => r.status === 401,
    //     }) || fail("ERROR: I'm still logged in!");

    // });

    sleep(10);
}
