const app = require("../../app.js");
const request = require("supertest");
const data = require("../../db/data/test-data/index.js");
const db = require("../../db/connection.js");
const seed = require("../../db/seeds/seed.js");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api/articles/:article_id", () => {
  test("200: should respond with 200 status code, and a singular article from the articles table in my database, matching the ID passed into the parameters.", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        const expectedOutput = {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          comment_count: "11",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        };
        expect(article).toEqual(expectedOutput);
      });
  });
  test("400: should return a 400 code if passed a parametric endpoint query that is of an invalid data type or format", () => {
    return request(app)
      .get("/api/articles/wrongEndPoint")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: should return a 404 code if passed a parametric endpoint this is a valid datatype, however responds with no results.", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Entry not found");
      });
  });
});
