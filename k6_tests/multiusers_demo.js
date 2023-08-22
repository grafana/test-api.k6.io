import { check, sleep, fail } from "k6";

import { authAPI } from "./lib/auth_api.js"
import { crocodilesAPI } from "./lib/crocodiles_api.js"


export let options = {
    duration: '20s',
    vus: 5,
    thresholds: {
        "http_req_duration": ["p(95)<500"]
    },
};


function randomString(anysize) {
    let charset = "abcdefghijklmnopqrstuvwxyz";
    let res = '';
    while (anysize--) res += charset[Math.random() * charset.length | 0];
    return res;
}


const conf = {
    baseURL: __ENV.BASE_URL || "https://test-api.k6.io",
    username: `${randomString(20)}@example.com`,
    password: "superCroc2019"
}


export default function() {
    const auth = authAPI(conf.baseURL);
    const { username, password } = conf;

    if(__ITER === 0) {
        const resp = auth.register({
            first_name: "Crocodile",
            last_name: "Owner",
            username,
            password,
            email: username,
        })
        check(resp, auth.registerChecks()) || fail(`could not register. Error: ${resp.body}`);
    }

    const loginRes = auth.login({ username, password });
    check(
        loginRes, auth.loginChecks()
    ) || fail(`Login failed: ${loginRes.status} ${loginRes.body}`)

    const crocs = crocodilesAPI(conf.baseURL, auth.authHeader(loginRes))

    const crocData = {
        name: `Name ${randomString(10)}`,
        sex: "M",
        date_of_birth: "2001-01-01",
    }
    const regResp = crocs.register(crocData)
    check(
        regResp, crocs.registerChecks()
    ) || fail(`Unable to create croc ${regResp.status} ${regResp.body}`);

    const crocID = regResp.json('id')
    check(
        crocs.rename(crocID, "new name"), crocs.renameChecks("new name")
    ) || fail(`Unable to rename croc ${resp.status} ${resp.body}`);

    check(
        crocs.deregister(crocID), crocs.deregisterChecks()
    ) || fail(`Croc was not deleted properly`);

    sleep(1);
}
