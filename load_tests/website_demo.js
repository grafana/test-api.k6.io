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

/* random number between integers
This is not necessary - It's added to force a performance alert in the test result
This is for demonstration purposes.  If you pass an env variable when running your test
you will force this alert. i.e. URL_ALERT=1 k6 run script.js
*/

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

/* Main function
The main function is what the virtual users will loop over during test execution.
*/
export default function() {
    // We define our first group.  Pages natually fit a concept of a group
    // You may have other similar actions you wish to "group" together
    group("Front page", function() {
        let res = null;
        // As mention above, this logic just forces a perf URL_ALERT
        // It also highlights the ability to programmatically do things right in your script
        if (__ENV.URL_ALERT) {
            res = http.get("http://test.loadimpact.com/?ts=" + Math.round(getRandomArbitrary(1,2000)));
        } else {
            res = http.get("http://test.loadimpact.com/");
        }
        let checkRes = check(res, {
            "status is 200": (r) => r.status === 200,
            "body is 1176 bytes": (r) => r.body.length === 1176,
            "is welcome header present": (r) => r.body.indexOf("Welcome to the LoadImpact.com demo site!") !== -1
        });

        // Record check failures
        checkFailureRate.add(!checkRes);

        // Record time to first byte and tag it with the URL to be able to filter the results in Insights
        timeToFirstByte.add(res.timings.waiting, { ttfbURL: res.url });

        // Load static assets
        group("Static assets", function() {
            let res = http.batch([
                ["GET", "http://test.loadimpact.com/style.css", {}, { tags: { staticAsset: "yes" } }],
                ["GET", "http://test.loadimpact.com/images/logo.png", {}, { tags: { staticAsset: "yes" } }]
            ]);
            checkRes = check(res[0], {
                "is status 200": (r) => r.status === 200
            });

            // Record check failures
            checkFailureRate.add(!checkRes);

            // Record time to first byte and tag it with the URL to be able to filter the results in Insights
            timeToFirstByte.add(res[0].timings.waiting, { ttfbURL: res[0].url, staticAsset: "yes" });
            timeToFirstByte.add(res[1].timings.waiting, { ttfbURL: res[1].url, staticAsset: "yes" });
        });

        sleep(10);
    });

    group("Login", function() {
        let res = http.get("http://test.loadimpact.com/my_messages.php");
        let checkRes = check(res, {
            "is status 200": (r) => r.status === 200,
            "is unauthorized header present": (r) => r.body.indexOf("Unauthorized") !== -1
        });

        // Record check failures
        checkFailureRate.add(!checkRes);

        res = http.post("http://test.loadimpact.com/login.php", { login: 'admin', password: '123', redir: '1' });
        checkRes = check(res, {
            "is status 200": (r) => r.status === 200,
            "is welcome header present": (r) => r.body.indexOf("Welcome, admin!") !== -1
        });

        // Record successful logins
        if (checkRes) {
            successfulLogins.add(1);
        }

        // Record check failures
        checkFailureRate.add(!checkRes, { page: "login" });

        // Record time to first byte and tag it with the URL to be able to filter the results in Insights
        timeToFirstByte.add(res.timings.waiting, { ttfbURL: res.url });

        sleep(10);
    });
}
