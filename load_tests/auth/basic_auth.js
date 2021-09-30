import { sleep, check } from "k6";
import encoding from "k6/encoding";

import { crocodiles } from "../modules/crocodiles.js"

export let options = {
    duration: '20s',
    vus: 5,
};

const conf = {
    baseURL: __ENV.BASE_URL || "https://test-api-main.staging.k6.io"
}


export default function() {
    const username = 'user'
    const password = 'test123!'
    const crocs = crocodiles(conf.baseURL, {
        headers: {
            "Authorization": "Basic " + encoding.b64encode(`${username}:${password}`)
        }
    });

    check(crocs.list(), crocs.listChecks()) || fail("could not get crocs")

    sleep(1);
}
