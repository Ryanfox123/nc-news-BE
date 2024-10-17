const app = require("../../app");
const request = require("supertest");
const data = require("../../db/data/test-data/index.js");
const db = require("../../db/connection.js");
const seed = require("../../db/seeds/seed.js");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("PATCH /api/articles/:article_id", () => {
  test("200: should patch the article via article ID, increasing its votes property by the amount passed in by the body ", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.votes).toBe(105);
      });
  });
});
