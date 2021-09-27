import { sleep } from "k6";

import { auth, crocodiles } from "../modules/register_users.js"


export let options = {
    duration: '1m',
    vus: 5,
};

const conf = {
    baseURL: __ENV.BASE_URL || "https://test-api.k6.io"
}


export default function() {
    const authn = auth(conf.baseURL)
    const authHeaders = authn.login({ username: 'user', password: 'test123!'});

    const crocs = crocodiles(conf.baseURL, authHeaders)
    crocs.list()

    sleep(1);
}
