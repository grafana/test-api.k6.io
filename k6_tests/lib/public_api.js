import http from "k6/http";
import { check } from "k6";


export const publicAPI = function(baseURL) {

  // call some public endpoints in batch
  const crocodiles = function(ids=[1,2,3,4]) {
    return http.batch(
      ids.map(i => ["GET", `${baseURL}/public/crocodiles/${i}/`, {}, {tags: {name: "PublicCrocs"}}])
    );
  }

  const crocodileChecks = function() {
    return {
      "crocReceivedWithName": (r) => r.json('name') !== ''
    }
  }

    return { crocodiles, crocodileChecks }
}
