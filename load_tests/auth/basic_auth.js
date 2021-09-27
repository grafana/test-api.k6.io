import { sleep } from "k6";
import encoding from "k6/encoding";

import { crocodiles } from "../modules/register_users.js"

export let options = {
    duration: '1m',
    vus: 5,
};

const conf = {
    baseURL: __ENV.BASE_URL || "https://test-api.k6.io"
}


export default function() {
    const username = 'user'
    const password = 'test123!'
    const crocs = crocodiles(conf.baseURL, {
        headers: {
            "Authorization": "Basic " + encoding.b64encode(`${username}:${password}`)
        }
    });

    crocs.list()

    sleep(1);
}
