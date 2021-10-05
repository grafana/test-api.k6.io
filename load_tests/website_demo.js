import http from "k6/http";
import { check, group, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

import { webPage } from './lib/webpage.js'

/* Options
Global options for your script
stages - Ramping pattern
thresholds - pass/fail criteria for the test
ext - Options used by Load Impact cloud service test name and distribution
*/
export let options = {
    stages: [
        { target: 1000, duration: "3m" },
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
                scenarioLabel1: { loadZone: "amazon:us:ashburn", percent: 100 },
                // scenarioLabel2: { loadZone: "amazon:ie:dublin", percent: 50 }
            }
        }
    }
};

// Custom metrics
// We instatiate them before our main function
const checkFailureRate = new Rate("check_failure_rate");
const timeToFirstByte = new Trend("time_to_first_byte", true);


function getBool(value) { return ["1", "t", "true", "True"].includes(value) }

const conf = {
    baseURL: __ENV.BASE_URL || "https://test-api.k6.io",
    urlAlert: getBool(__ENV.URL_ALERT)
}

/* Main function
The main function is what the virtual users will loop over during test execution.
*/
export default function() {
    const webp = webPage(conf.baseURL, conf.urlAlert);

    let resp;

    // We define our first group.  Pages natually fit a concept of a group
    // You may have other similar actions you wish to "group" together
    group("Front page", function() {
        // Record time to first byte and tag it with the URL to be able to filter the results in Insights
        resp = webp.frontPage()
        timeToFirstByte.add(resp.timings.waiting, { ttfbURL: resp.url });

        // Record check failures
        const chRes = check(resp, webp.frontPageChecks());
        checkFailureRate.add(!chRes);
  
        // Load static assets
        group("Static assets", function() {
            // Record time to first byte and tag it with the URL to be able to filter the results in Insights
            resp = webp.staticAssets();
            timeToFirstByte.add(resp[0].timings.waiting, { ttfbURL: resp[0].url, staticAsset: "yes" });
            timeToFirstByte.add(resp[1].timings.waiting, { ttfbURL: resp[1].url, staticAsset: "yes" });

            // Record check failures
            const chRes = check(resp[0], webp.staticAssetsChecks())
            checkFailureRate.add(!chRes);
        });

        sleep(10);
    });

}
