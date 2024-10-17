const app = require("../app");
const request = require("supertest");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const endpoints = require("../endpoints.json");
const toBeSorted = require("jest-sorted");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("404: Endpoint not found", () => {
  test("should trigger a catch all endpoint for any requests that arent found in the api, and return a 404", () => {
    return request(app)
      .get("/api/wrongendpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("The requested endpoint does not exist.");
      });
  });
});

describe("200 GET /api", () => {
  test("should respond with a 200 status and a JSON object that lists and details all current functional endpoints on my API.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});
