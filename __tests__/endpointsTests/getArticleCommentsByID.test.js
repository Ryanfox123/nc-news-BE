const app = require("../../app");
const request = require("supertest");
const data = require("../../db/data/test-data/index.js");
const db = require("../../db/connection.js");
const seed = require("../../db/seeds/seed.js");
const toBeSorted = require("jest-sorted");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Should respond with an array of all comments for given article ID", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const articleComments = body.comments;
        const commentSchema = {
          body: "string",
          votes: "number",
          author: "string",
          article_id: "number",
          created_at: "string",
        };
        articleComments.forEach((comment) => {
          for (const key in commentSchema) {
            expect(typeof comment[key]).not.toBe(undefined);
            expect(commentSchema[key]).toBe(typeof comment[key]);
          }
        });
      });
  });
  test("200: comments should be returned sorted by most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const articleComments = body.comments;
        expect(articleComments).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
  test("200: returns an empty array if a valid article ID is passed but the article has no comments.", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        const articleComments = body.comments;
        expect(articleComments.length).toBe(0);
      });
  });
  test("400: should return 400 error code and message if parametric endpoint is of wrong type or formatted incorrectly.", () => {
    return request(app)
      .get("/api/articles/wrong/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: should return 404 error code and message if parametric endpoint is of correct type but doesnt yield any results.", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Entry not found");
      });
  });
});
