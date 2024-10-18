const app = require("../../app");
const request = require("supertest");
const data = require("../../db/data/test-data/index.js");
const db = require("../../db/connection.js");
const seed = require("../../db/seeds/seed.js");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("POST /api/articles", () => {
  test("200: should post a new article to my articles table, containing all the valid information of an article", () => {
    return request(app)
      .post("/api/articles/")
      .send({
        author: "lurker",
        title: "first article",
        body: "boring stuff",
        topic: "paper",
      })
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.title).toBe("first article");
        expect(article.body).toBe("boring stuff");
        expect(article.votes).toBe(0);
        expect(article.author).toEqual("lurker");
        expect(article.article_id).toBe(14);
        expect(typeof article.created_at).toEqual("string");
        expect(article.article_img_url).toBe(
          "https://i.pinimg.com/564x/ed/d5/02/edd502762e217ed59da71d007ec1ff3b.jpg"
        );
        expect(article.comment_count).toBe(0);
        expect(article.topic).toBe("paper");
      });
  });
  test("400: If an incomplete body is passed, should throw a 400 bad request error.", () => {
    return request(app)
      .post("/api/articles/")
      .send({
        author: "lurker",
        title: "first article",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: You are missing body information");
      });
  });
  test("404: should give an error if a user tries to create an article on a topic that has not yet been created.", () => {
    return request(app)
      .post("/api/articles/")
      .send({
        author: 2,
        title: "first article",
        body: "boring stuff",
        topic: "cooking",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Article does not exist: please post to an existant article"
        );
      });
  });
  test("404: should give an error if an invalid user tries to create an article.", () => {
    return request(app)
      .post("/api/articles/")
      .send({
        author: "Ryan",
        title: "first article",
        body: "boring stuff",
        topic: "paper",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "This user does not exist: please post from an existing user"
        );
      });
  });
});
