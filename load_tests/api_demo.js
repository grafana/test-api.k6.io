import {group, sleep, fail} from "k6";
import {Trend} from "k6/metrics";

import { auth } from "./modules/auth.js"
import { crocodiles } from "./modules/crocodiles.js"
import { apiClient } from "./modules/api.js"


const conf = {
  baseURL: __ENV.BASE_URL || "https://test-api.k6.io"
}


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


let timeToFirstByte = new Trend("time_to_first_byte", true);


export default function() {
    const authn = auth(conf.baseURL)
    const crocs = crocodiles(conf.baseURL)

    group("Public endpoints", () => {
        apiClient.publicEndpoints()
    });

    group("Login", () => {
        authn.cookieLogin({
            username: 'user',
            password: 'test123!',
            email: 'user@example.com'
        }, timeToFirstByte);

        crocs.list()
    });

    let newCrocId = null;
    group("Retrieve and modify crocodiles", () => {
        // create new croc
        newCrocId = crocs.register({
        "name": "Curious George",
        "sex": "M",
        "date_of_birth": "1982-03-03",
        }, { tags: { endpointType: "modifyCrocs" }});

        crocs.rename(newCrocId, "New name", {tags: {name: 'Croc Operation'}});
    });

    group("Delete and verify", () => {
        crocs.deregister(newCrocId, {tags: {name: 'Croc Operation'}});
        crocs.get(newCrocId, {tags: {name: 'Retrieve Deleted Croc'}});
    });

    group("Log me out!", () => {
        authn.cookieLogout({})
        crocs.list()
    });

    sleep(1);
}
