import { Counter, Rate, Trend } from "k6/metrics";
import { websiteDemo } from "./modules/website.js"


const conf = {
    baseURL: __ENV.BASE_URL || "https://test.k6.io",
    urlAlert: !!__ENV.URL_ALERT || false
}

var successfulLogins = new Counter("successful_logins");
var checkFailureRate = new Rate("check_failure_rate");
var timeToFirstByte = new Trend("time_to_first_byte", true);


export let options = {
    stages: [
        { target: 20, duration: "1m" },
        // { target: 200, duration: "3m" },
        // { target: 0, duration: "1m" }
    ],
    thresholds: {
        "http_req_duration": ["p(95)<500"],
        "http_req_duration{staticAsset:yes}": ["p(95)<100"],
        "check_failure_rate": ["rate<0.3"]
    },
    ext: {
        loadimpact: {
            name: "Insights Demo with Cloud Execution",
            distribution: {
                scenarioLabel1: { loadZone: "amazon:us:ashburn", percent: 50 },
                scenarioLabel2: { loadZone: "amazon:ie:dublin", percent: 50 }
            }
        }
    }
};

export default function() {
    websiteDemo(conf.baseURL, checkFailureRate, timeToFirstByte, successfulLogins, conf.urlAlert);
}
