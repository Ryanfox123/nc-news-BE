const app = require("../../app");
const request = require("supertest");
const data = require("../../db/data/test-data/index.js");
const db = require("../../db/connection.js");
const seed = require("../../db/seeds/seed.js");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("POST /api/articles/:article_id/comments", () => {
  test("200: should post a new comment to the comments table with the parametric endpoint of article_id and respond with the comment object upon completion.", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "rogersop", body: "My first comment" })
      .expect(200)
      .then(({ body }) => {
        const comment = body.comment;
        expect(typeof comment.body).toEqual("string");
        expect(typeof comment.votes).toEqual("number");
        expect(typeof comment.author).toEqual("string");
        expect(typeof comment.article_id).toEqual("number");
        expect(typeof comment.created_at).toEqual("string");
      });
  });
  test("400: should return an error and message if a user who doesnt exist is passed as the body for comment.", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "Ryanfox123", body: "I shouldnt be here!" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: should return an error and message if parametric end point of article is of invalid type.", () => {
    return request(app)
      .post("/api/articles/wrong/comments")
      .send({ username: "rogersop", body: "I shouldnt be here!" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: should return an error and message if parametric end point is of valid type, however no article exists for the comment to exist on.", () => {
    return request(app)
      .post("/api/articles/999/comments")
      .send({ username: "rogersop", body: "I shouldnt be here!" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Entry not found");
      });
  });
});
