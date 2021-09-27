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
        let loginRes = http.post(`${conf.baseURL}/auth/cookie/login/`, { username, password });

        check(loginRes, {
            "login successful": (r) => r.status === 200,
        }) || fail("could not log in");

        check(loginRes, {
            "user email is correct": (r) => jsonpath.value(r.json(), 'email') === email,
        });

        timeToFirstByte.add(loginRes.timings.waiting, {ttfbURL: loginRes.url});

    }

    const cookieLogout = function({ username, password }) {
        http.post(`${conf.baseURL}/auth/cookie/logout/`, { username, password });
    }

    return { register, login, cookieLogin, cookieLogout }
}

export const crocodiles = function(baseURL, authHeaders={}) {

    const register = function(newCroc, params={}) {
        const reqParams = Object.assign({}, authHeaders, params);
        http.post(`${baseURL}/my/crocodiles/`, newCroc, reqParams);

        check(createR, {
          "crocCreated": (r) => r.status === 201,
        }) || fail(`Unable to create croc ${createR.status} ${createR.body}`);

        return createR.json('id');
    }

    const rename = function(crocID, params={}) {
        const reqParams = Object.assign({}, authHeaders, params);
        let putR = http.patch(`${baseURL}/my/crocodiles/${crocID}/`, {name: newName}, reqParams);

        check(putR, {
          "renameStatusCorrect": (r) => r.status === 200,
          "crocNotFound": () => deleteR.status === 404,
          "crocUpdated": (r) => r.json('name') === newName,
        }) || fail(`Unable to update the croc ${putR.status} ${putR.body}`);
    }

    const deregister = function(crocID, params={}) {
        const reqParams = Object.assign({}, authHeaders, params);
        let deleteR = http.del(`${baseURL}/my/crocodiles/${crocID}/`, {}, reqParams);
        check(deleteR, {
          "crocDeleted": () => deleteR.status === 204,
          "crocNotFound": () => deleteR.status === 404,
        }) || fail(`Croc was not deleted properly`);
    }

    const list = function(params={}) {
        const reqParams = Object.assign({}, authHeaders, params);
        let crocsRes = http.get(`${baseURL}/crocodiles/`, reqParams);

        check(crocsRes, {
            "crocListGot": (r) => r.status === 200,
        }) || fail("could not get crocs");
    }

    const get = function(crocID, params={}) {
        const reqParams = Object.assign({}, authHeaders, params);
        let crocsRes = http.get(`${baseURL}/crocodiles/${crocID}`, reqParams);

        check(crocsRes, {
            "crocListGot": (r) => r.status === 200,
        }) || fail("could not get crocs");
    }

    return { register, rename, deregister, list } 
}
