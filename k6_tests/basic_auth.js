import { sleep, check } from "k6";
import encoding from "k6/encoding";

import { crocodilesAPI } from "./lib/crocodiles_api.js"

export let options = {
    duration: '20s',
    vus: 5,
};

const conf = {
    baseURL: __ENV.BASE_URL || "https://test-api.k6.io",
    username: 'user',
    password: 'test123!'
}


export default function() {

    const authHeader = {
        headers: {
            "Authorization": "Basic " + encoding.b64encode(`${conf.username}:${conf.password}`)
        }
    }

    const crocs = crocodilesAPI(conf.baseURL, authHeader);

    check(crocs.list(), crocs.listChecks());

    sleep(1);
}
