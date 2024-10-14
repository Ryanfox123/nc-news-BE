const app = require("../app");
const request = require("supertest");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");

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

describe("200: GET /api/topics", () => {
  test("should respond with 200 status code, and an array of topic objects containing a slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(Array.isArray(topics)).toBe(true);
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});
