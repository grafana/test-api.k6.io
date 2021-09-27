import http from "k6/http";
import { check, group, sleep } from "k6";

/* random number between integers
This is not necessary - It's added to force a performance alert in the test result
This is for demonstration purposes.  If you pass an env variable when running your test
you will force this alert. i.e. URL_ALERT=1 k6 run script.js
*/

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


export const websiteDemo = function(baseURL, successfulLoginsCounter, urlAlert=false) {
    
    const frontPage = function(checkFailureRate, timeToFirstByteTrend) {
        let res = null;
        // As mention above, this logic just forces a perf URL_ALERT
        // It also highlights the ability to programmatically do things right in your script
        if (urlAlert) {
            res = http.get(`${baseURL}/?ts=${Math.round(getRandomArbitrary(1,2000))}`);
        } else {
            res = http.get(baseURL);
        }
        let checkRes = check(res, {
            "status is 200": (r) => r.status === 200,
            "body is 1176 bytes": (r) => r.body.length === 1176,
            "is welcome header present": (r) => r.body.indexOf("Welcome to the k6.io demo site!") !== -1
        });
  
        // Record check failures
        checkFailureRate.add(!checkRes);
  
        // Record time to first byte and tag it with the URL to be able to filter the results in Insights
        timeToFirstByteTrend.add(res.timings.waiting, { ttfbURL: res.url });
  
    }

    const staticAssets = function(checkFailureRate, timeToFirstByteTrend) {
        let res = http.batch([
            ["GET", `${baseURL}/style.css`, {}, { tags: { staticAsset: "yes" } }],
            ["GET", `${baseURL}/images/logo.png`, {}, { tags: { staticAsset: "yes" } }]
        ]);
        checkRes = check(res[0], {
            "is status 200": (r) => r.status === 200
        });

        // Record check failures
        checkFailureRate.add(!checkRes);

        // Record time to first byte and tag it with the URL to be able to filter the results in Insights
        timeToFirstByteTrend.add(res[0].timings.waiting, { ttfbURL: res[0].url, staticAsset: "yes" });
        timeToFirstByteTrend.add(res[1].timings.waiting, { ttfbURL: res[1].url, staticAsset: "yes" });
    }

    const login = function(checkFailureRate, timeToFirstByteTrend, successfulLoginsCounter) {

        let res = http.get(`${baseURL}/my_messages.php`);
        let checkRes = check(res, {
            "is status 200": (r) => r.status === 200,
            "is unauthorized header present": (r) => r.body.indexOf("Unauthorized") !== -1
        });
  
        // Record check failures
        checkFailureRate.add(!checkRes);
  
        res = http.post(`${baseURL}/login.php`, { login: 'admin', password: '123', redir: '1' });
        checkRes = check(res, {
            "is status 200": (r) => r.status === 200,
            "is welcome header present": (r) => r.body.indexOf("Welcome, admin!") !== -1
        });
  
        // Record successful logins
        if (checkRes) {
            successfulLoginsCounter.add(1);
        }
  
        // Record check failures
        checkFailureRate.add(!checkRes, { page: "login" });
  
        // Record time to first byte and tag it with the URL to be able to filter the results in Insights
        timeToFirstByteTrend.add(res.timings.waiting, { ttfbURL: res.url });
    }

    return {frontPage, staticAssets, login}
}
