const app = require("../../app.js");
const request = require("supertest");
const data = require("../../db/data/test-data/index.js");
const db = require("../../db/connection.js");
const seed = require("../../db/seeds/seed.js");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("200:  GET /api/users/:username", () => {
  test("200: should respond with a 200 and spcific user profile when given a valid username", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then(({ body }) => {
        const user = body.user;
        expect(user.username).toBe("icellusedkars");
        expect(user.name).toBe("sam");
      });
  });
  test("400: should respond with a 400 if username doesnt match my username regex; Should start with a letter, any other character can be letter, underscore or number, must be between 8-30 chars.", () => {
    return request(app)
      .get("/api/users/_ryanfox")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: should respond with a 404 if username matches regex but doesnt exist on the database..", () => {
    return request(app)
      .get("/api/users/Ryanfox123")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});
