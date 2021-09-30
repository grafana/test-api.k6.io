import { sleep, check, fail } from "k6";

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
    const crocs = crocodiles(conf.baseURL)

    check(
        authn.cookieLogin({ username: 'user', password: 'test123!'}),
        authn.cookieLoginChecks('user@example.com')
    ) || fail("could not log in");



    check(crocs.list(), crocs.listChecks()) || fail("could not get crocs");

    let res = authn.cookieLogout()
    check(res, authn.cookieLogoutChecks()) || fail(`could not get logout: ${res.status} ${res.body}`);

    sleep(1);
}
