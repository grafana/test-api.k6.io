import {group, sleep, fail, check} from "k6";
import {Trend} from "k6/metrics";

import { auth } from "./modules/auth.js"
import { crocodiles } from "./modules/crocodiles.js"
import { publicApi } from "./modules/public_api.js"


const conf = {
  baseURL: __ENV.BASE_URL || "https://test-api-main.staging.k6.io"
}


export let options = {
  stages: [
    {target: 1000, duration: "1m"},
  ],
  thresholds: {
    "http_req_duration": ["p(95)<500"],
    "http_req_duration{publicEndpoint:yes}": ["p(95)<100"],
    "check_failure_rate": ["rate<0.3"]
  },
};


let timeToFirstByte = new Trend("time_to_first_byte", true);


export default function() {
    const authn = auth(conf.baseURL);
    const crocs = crocodiles(conf.baseURL);
    const pbApi = publicApi(conf.baseURL);

    let resp, chks;

    group("Public endpoints", () => {
      
      pbApi.crocodiles()
    });

    group("Login", () => {
        authn.cookieLogin({
            username: 'user',
            password: 'test123!',
            email: 'user@example.com'
        }, timeToFirstByte);

        resp = crocs.list();
        check(resp, crocs.listChecks()) || fail("could not get crocs")
    });

    let newCrocID = null;
    group("Retrieve and modify crocodiles", () => {
        // create new croc
        resp = crocs.register({
          "name": "Curious George",
          "sex": "M",
          "date_of_birth": "1982-03-03",
        }, { tags: { endpointType: "modifyCrocs" }});
        check(resp, crocs.registerChecks()) || fail(`Unable to create croc ${resp.status} ${resp.body}`);

        newCrocID = resp.json('id')

        resp = crocs.rename(newCrocID, "New name", {tags: {name: 'Croc Operation'}})
        check(resp, crocs.renameChecks("New name")) || fail(`Unable to update the croc ${resp.status} ${resp.body}`);
    });

    group("Delete and verify", () => {
        check(
          crocs.deregister(newCrocID, {tags: {name: 'Croc Operation'}}), crocs.deregisterChecks()
        );

        resp = crocs.get(newCrocID, {tags: {name: 'Retrieve Deleted Croc'}});
        check(resp, {
          "crocNotFound": (r) => r.status === 404,
        }) || fail("croc was not deleted properly");
    });

    group("Log me out!", () => {
        authn.cookieLogout({})
        check(crocs.list(), {
          "got crocs": (r) => r.status === 401,
        }) || fail("ERROR: I'm still logged in!");
    });

    sleep(1);
}
