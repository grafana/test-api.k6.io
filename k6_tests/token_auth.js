import { check, sleep } from "k6";

import { authAPI } from "./lib/auth_api.js"
import { crocodilesAPI } from "./lib/crocodiles_api.js"


export let options = {
    duration: '20s',
    vus: 5,
};

const conf = {
    baseURL: __ENV.BASE_URL || "https://test-api.k6.io"
}

export default function() {
    const auth = authAPI(conf.baseURL)

    const loginRes = auth.login({ username: 'user', password: 'test123!'})
    check(loginRes, auth.loginChecks)

    const authHeaders = auth.authHeader(loginRes);
    const crocs = crocodilesAPI(conf.baseURL, authHeaders)
    check(crocs.list(), crocs.listChecks)

    sleep(1);
}
