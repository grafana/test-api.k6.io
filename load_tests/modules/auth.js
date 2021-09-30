import http from "k6/http";

import { check, fail } from "k6";


export const auth = function(baseURL) {

    const register = function(credentials) {
        let createResp = http.post(`${baseURL}/user/register/`, credentials);
    
        check(createResp, {
            "created user": (r) => r.status === 201,
        }) || fail(`could not register. Error: ${createResp.body} `);
    }

    const login = function({ username, password }) {
        let loginRes = http.post(`${baseURL}/auth/token/login/`, { username, password });
    
        let authToken = loginRes.json('access');

        check(authToken, {
            "logged in successfully": (authToken) => authToken !== '',
        });

        return {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        };
    }

    const cookieLogin = function({ username, password, email }, timeToFirstByte) {
        const loginRes = http.post(`${conf.baseURL}/auth/cookie/login/`, { username, password });

        check(loginRes, {
            "login successful": (r) => r.status === 200,
        }) || fail("could not log in");

        check(loginRes, {
            "user email is correct": (r) => r.json('email') === email,
        });

        if (timeToFirstByte) {
            timeToFirstByte.add(loginRes.timings.waiting, {ttfbURL: loginRes.url});
        }

        return loginRes;
    }

    const cookieLogout = function({ username, password }) {
        http.post(`${conf.baseURL}/auth/cookie/logout/`, { username, password });
    }

    return { register, login, cookieLogin, cookieLogout }
}
