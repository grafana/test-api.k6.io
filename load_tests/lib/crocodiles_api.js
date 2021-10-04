import http from "k6/http";


export const crocodilesAPI = function(baseURL, commonParams={}) {

    const register = function(newCroc, params={}) {
        const reqParams = Object.assign({}, commonParams, params);
        const createR = http.post(`${baseURL}/my/crocodiles/`, newCroc, reqParams);

        return createR
    }

    const registerChecks = function() {
        return {
            "crocRegistered": (r) => r.status === 201,
        }
    }

    const rename = function(crocID, newName, params={}) {
        const reqParams = Object.assign({}, commonParams, params);
        const patchR = http.patch(`${baseURL}/my/crocodiles/${crocID}/`, {name: newName}, reqParams);

        return patchR;
    }

    const renameChecks = function(newName) {
        return {
            "crocRenamed": (r) => r.status === 200 && r.json('name') === newName,
        }
    }

    const deregister = function(crocID, params={}) {
        const reqParams = Object.assign({}, commonParams, params);
        const deleteR = http.del(`${baseURL}/my/crocodiles/${crocID}/`, {}, reqParams);

        return deleteR
    }

    const deregisterChecks = function() {
        return {
            "crocDeregistered": (r) => r.status === 204
        }
    }

    const list = function(params={}) {
        const reqParams = Object.assign({}, commonParams, params);
        const crocsRes = http.get(`${baseURL}/my/crocodiles/`, reqParams);

        return crocsRes
    }

    const listChecks = function() {
        return {
            "crocListReceived": (r) => r.status === 200,
        }
    }

    const get = function(crocID, params={}) {
        const reqParams = Object.assign({}, commonParams, params);
        let crocR = http.get(`${baseURL}/my/crocodiles/${crocID}`, reqParams);

        return crocR;
    }

    const getChecks = function() {
        return {
            "crocListReceived": (r) => r.status === 200,
        }
    }

    return {
        register, rename, deregister, list, get,
        registerChecks, renameChecks, deregisterChecks, listChecks, getChecks,
    } 
}
