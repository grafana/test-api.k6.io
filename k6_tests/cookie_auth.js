import { sleep, check } from "k6";

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
    const crocs = crocodilesAPI(conf.baseURL)

    check(
        auth.cookieLogin({ username: 'user', password: 'test123!'}),
        auth.cookieLoginChecks('user@example.com')
    );

    check(crocs.list(), crocs.listChecks());

    let res = auth.cookieLogout()
    check(res, auth.cookieLogoutChecks());

    sleep(1);
}
