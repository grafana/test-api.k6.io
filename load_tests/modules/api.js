import http from "k6/http";
import { check } from "k6";


export const apiClient = function(baseURL) {

    // call some public endpoints in batch
    const publicEndpoints = function() {
        let responses = http.batch([
            ["GET", `${baseURL}/public/crocodiles/1/`, {}, {tags: {name: "PublicCrocs"}}],
            ["GET", `${baseURL}/public/crocodiles/2/`, {}, {tags: {name: "PublicCrocs"}}],
            ["GET", `${baseURL}/public/crocodiles/3/`, {}, {tags: {name: "PublicCrocs"}}],
            ["GET", `${baseURL}/public/crocodiles/4/`, {}, {tags: {name: "PublicCrocs"}}],
          ]);
      
          // check that all the crocodiles we fetched have names
          Object.values(responses).map(resp => check(resp, {
            "crocs have names": (resp) => resp.json('name') !== ''
          }))
    }

    return { publicEndpoints }
}
