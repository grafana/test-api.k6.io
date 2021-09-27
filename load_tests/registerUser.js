import { sleep } from "k6";
import { auth } from "./modules/auth.js"
import { crocodiles } from "./modules/crocodiles.js"


export let options = {
    stages: [
        { target: 2, duration: "180s" },
    ],
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
    baseURL: __ENV.BASE_URL || "https://test-api.k6.io"
}


export default function() {
    const authn = auth(conf.baseURL);

    if(__ITER === 0) {
        const username = `${randomString(10)}@example.com`
        const password = "superCroc2019"
        authn.register({
            first_name: "Crocodile",
            last_name: "Owner",
            username,
            password 
        })
    }

    const authHeaders = authn.login({ username, password })
    const crocs = crocodiles(conf.baseURL, authHeaders)
    const crocData = {
        name: `Name ${randomString(10)}`,
        sex: "M",
        date_of_birth: "2001-01-01",
    }
    const crocID = crocs.register(crocData)
    crocs.rename(crocID, "new name")
    crocs.deregister(crocID)

    sleep(1);
}
