const app = require("../../app.js");
const request = require("supertest");
const data = require("../../db/data/test-data/index.js");
const db = require("../../db/connection.js");
const seed = require("../../db/seeds/seed.js");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("200:  GET /api/users/:username", () => {
  test("200: should respond with a 200 and spcific user profile when given a valid username", () => {});
});
