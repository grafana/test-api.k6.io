import http from "k6/http";
import { check } from "k6";


export const publicApi = function(baseURL) {

  // call some public endpoints in batch
  const crocodiles = function(ids=[1,2,3,4]) {
    const responses = http.batch(
      ids.map(i => ["GET", `${baseURL}/public/crocodiles/${i}/`, {}, {tags: {name: "PublicCrocs"}}])
    );
  
    // check that all the crocodiles we fetched have names
    Object.values(responses).map(r => check(r, {
      "crocReceivedWithName": (r) => r.json('name') !== ''
    }));

    return responses
  }

    return { crocodiles }
}
