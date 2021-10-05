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


export const webPage = function(baseURL, urlAlert=false) {

    const frontPage = function() {
        // As mention above, this logic just forces a perf URL_ALERT
        // It also highlights the ability to programmatically do things right in your script
        if (urlAlert) {
            return http.get(`${baseURL}/?ts=${Math.round(getRandomArbitrary(1,2000))}`);
        }
        
        return http.get(baseURL);  
    }
    
    const frontPageChecks = function() {
        return {
            "status is 200": (r) => r.status === 200,
            "body is 1176 bytes": (r) => r.body.length === 1176,
            "is welcome header present": (r) => r.body.indexOf("Welcome to the k6.io demo site!") !== -1
        };  
    }

    const staticAssets = function() {
        return http.batch([
            ["GET", `${baseURL}/static/css/site.css`, {}, { tags: { staticAsset: "yes" } }],
            ["GET", `${baseURL}/static/js/prisms.js`, {}, { tags: { staticAsset: "yes" } }]
        ]);
    }

    const staticAssetsChecks = function() {
        return {
            "is status 200": (r) => r.status === 200
        };
    }

    return {
        frontPage, staticAssets,
        frontPageChecks, staticAssetsChecks,
    }
}
