import { sleep, check, fail } from "k6";

import { authAPI } from "../lib/auth_api.js"
import { crocodilesAPI } from "../lib/crocodiles_api.js"


export let options = {
    duration: '1m',
    vus: 5,
};

const conf = {
    baseURL: __ENV.BASE_URL || "https://test-api.k6.io"
}

export default function() {
    const auth = authAPI(conf.baseURL)
    const crocs = crocodilesAPI(conf.baseURL)

    check(
        auth.cookieLogin({ username: 'user', password: 'test123!'}),
        auth.cookieLoginChecks('user@example.com')
    ) || fail("could not log in");



    check(crocs.list(), crocs.listChecks()) || fail("could not get crocs");

    let res = auth.cookieLogout()
    check(res, auth.cookieLogoutChecks()) || fail(`could not get logout: ${res.status} ${res.body}`);

    sleep(1);
}
