const app = require("../../app");
const request = require("supertest");
const data = require("../../db/data/test-data/index.js");
const db = require("../../db/connection.js");
const seed = require("../../db/seeds/seed.js");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Should update a given comments total votes (increasing or decreasing) based on the amount passed into the request body", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment.votes).toBe(21);
      });
  });
  test("400: if request body for inc_votes is of wrong data type, should throw an error for bad request ", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "Five" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: if request body is empty, should throw an error for bad request ", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: you must provide a request body.");
      });
  });
});
