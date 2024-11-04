import chai, {
  describe,
  expect,
} from "https://jslib.k6.io/k6chaijs/4.3.4.3/index.js";
import { Httpx, Get } from "https://jslib.k6.io/httpx/0.0.6/index.js";
import { randomString } from "https://jslib.k6.io/k6-utils/1.0.0/index.js";

chai.config.logFailures = true;

export let options = {
  thresholds: {
    // fail the test if any checks fail or any requests fail
    checks: ["rate == 1.00"],
    http_req_failed: ["rate == 0.00"],
  },
  vus: 1,
  iterations: 1,
};

let session = new Httpx({
  baseURL: __ENV.BASE_URL || "https://test-api.k6.io",
});

function retrieveIndividualCrocodilesInABatch() {
  describe("[Crocs service] Fetch public crocs one by one", () => {
    let responses = session.batch([
      new Get("/public/crocodiles/1/"),
      new Get("/public/crocodiles/2/"),
      new Get("/public/crocodiles/3/"),
    ]);

    expect(responses, "responses").to.be.an("array");

    responses.forEach((response) => {
      expect(response.status, "response status").to.equal(200);
      expect(response).to.have.validJsonBody();
      expect(response.json(), "crocodile").to.be.an("object");
      expect(response.json(), "crocodile").to.include.keys(
        "age",
        "name",
        "id",
        "sex"
      );
      expect(response.json(), "crocodile").to.not.have.a.property("outfit");
    });
  });
}

function retieveAllPublicCrocodiles() {
  describe("[Crocs service] Fetch a list of crocs", () => {
    let response = session.get("/public/crocodiles");

    expect(response.status, "response status").to.equal(200);
    expect(response).to.have.validJsonBody();
    expect(response.json(), "croc list").to.be.an("array").lengthOf.above(5);
  });
}

function validateAuthService() {
  const USERNAME = `${randomString(10)}@example.com`;
  const PASSWORD = "superCroc2021";

  describe("[Registration service] user registration", () => {
    let sampleUser = {
      username: USERNAME,
      password: PASSWORD,
      email: USERNAME,
      first_name: "John",
      last_name: "Smith",
    };

    let response = session.post(`/user/register/`, sampleUser);

    expect(response.status, "registration status").to.equal(201);
    expect(response).to.have.validJsonBody();
  });

  describe("[Auth service] user authentication", () => {
    let authData = {
      username: USERNAME,
      password: PASSWORD,
    };

    let resp = session.post(`/auth/token/login/`, authData);

    expect(resp.status, "Auth status").to.be.within(200, 204);
    expect(resp).to.have.validJsonBody();
    expect(resp.json()).to.have.a.property("access");
    expect(resp.json("access"), "auth token").to.be.a("string");

    let authToken = resp.json("access");
    // set the authorization header on the session for the subsequent requests.
    session.addHeader("Authorization", `Bearer ${authToken}`);
  });
}

function validateCrocodileCreation() {
  // authentication happened before this call.

  describe("[Croc service] Create a new crocodile", () => {
    let payload = {
      name: `Croc Name`,
      sex: "M",
      date_of_birth: "2019-01-01",
    };

    let resp = session.post(`/my/crocodiles/`, payload);

    expect(resp.status, "Croc creation status").to.equal(201);
    expect(resp).to.have.validJsonBody();

    session.newCrocId = resp.json("id"); // caching croc ID for the future.
  });

  describe("[Croc service] Fetch private crocs", () => {
    let response = session.get("/my/crocodiles/");

    expect(response.status, "response status").to.equal(200);
    expect(response, "private crocs").to.have.validJsonBody();
    expect(response.json(), "private crocs").to.not.be.empty;
  });
}

export default function () {
  retrieveIndividualCrocodilesInABatch();
  retieveAllPublicCrocodiles();
  validateAuthService();
  validateCrocodileCreation();
}
