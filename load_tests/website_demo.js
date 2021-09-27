import http from "k6/http";
import { check, group, sleep } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";

/* Options
Global options for your script
stages - Ramping pattern
thresholds - pass/fail criteria for the test
ext - Options used by Load Impact cloud service test name and distribution
*/
export let options = {
    stages: [
        { target: 200, duration: "1m" },
        { target: 200, duration: "3m" },
        { target: 0, duration: "1m" }
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

// Custom metrics
// We instatiate them before our main function
var successfulLogins = new Counter("successful_logins");
var checkFailureRate = new Rate("check_failure_rate");
var timeToFirstByte = new Trend("time_to_first_byte", true);


const conf = {
    baseURL: __ENV.BASE_URL || "https://test-api.k6.io",
    urlAlert: __ENV.URL_ALERT
}

/* Main function
The main function is what the virtual users will loop over during test execution.
*/
export default function() {
    const website = websiteDemo(conf.baseURL, conf.urlAlert);
    // We define our first group.  Pages natually fit a concept of a group
    // You may have other similar actions you wish to "group" together
    group("Front page", function() {
        website.frontPage(checkFailureRate, timeToFirstByte);
        // Load static assets
        group("Static assets", function() {
            website.staticAssets(checkFailureRate, timeToFirstByte);
        });
        sleep(10);
    });
  
    group("Login", function() {
        website.staticAssets(checkFailureRate, timeToFirstByte, successfulLogins);
        sleep(10);
    });
}
