import { check, sleep } from "k6";

import { auth } from "../modules/auth.js"
import { crocodiles } from "../modules/crocodiles.js"


export let options = {
    duration: '1m',
    vus: 5,
};

const conf = {
    baseURL: __ENV.BASE_URL || "https://test-api.k6.io"
}

export default function() {
    const authn = auth(conf.baseURL)

    const loginRes = authn.login({ username: 'user', password: 'test123!'})
    check(loginRes, authn.loginChecks)

    const authHeaders = authn.authHeader(loginRes);
    const crocs = crocodiles(conf.baseURL, authHeaders)
    check(crocs.list(), crocs.listChecks)

    sleep(1);
}
