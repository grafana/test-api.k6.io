import http from "k6/http";


export const authAPI = function(baseURL) {

    const register = function(credentials) {
        return http.post(`${baseURL}/user/register/`, credentials);
    }

    const registerChecks = function() {
        return {
            "created user": (r) => r.status === 201,
        }
    }

    const login = function({ username, password }) {
        return http.post(`${baseURL}/auth/token/login/`, { username, password });
    }

    const loginChecks = function() {
        return {
            "login successful": (r) => r.status === 200,
            "access token is present": (r) => r.json('access') !== '',
        }
    }
    
    const authHeader = function (loginResponse) {
        const authToken = loginResponse.json('access');
        return {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        };
    }

    const cookieLogin = function({ username, password }) {
        return http.post(`${baseURL}/auth/cookie/login/`, { username, password });
    }

    const cookieLoginChecks = function(email) {
        return {
            "login successful": (r) => r.status === 200,
            "user email is correct": (r) => r.json('email') === email,
        };
    }

    const cookieLogout = function() {
        return http.post(`${baseURL}/auth/cookie/logout/`);
    }

    const cookieLogoutChecks = function() {
        return {
            "logout successful": (r) => r.status === 200
        };
    }

    return {
        register, login, cookieLogin, cookieLogout, authHeader,
        registerChecks, loginChecks, cookieLoginChecks, cookieLogoutChecks
    }

}
