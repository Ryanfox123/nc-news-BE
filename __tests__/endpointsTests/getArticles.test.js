const app = require("../../app.js");
const request = require("supertest");
const data = require("../../db/data/test-data/index.js");
const db = require("../../db/connection.js");
const seed = require("../../db/seeds/seed.js");
const toBeSorted = require("jest-sorted");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api/articles", () => {
  test("200: Should respond with 200 status code and all current articles with their comment counts.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        const articlesSchema = {
          article_id: "number",
          title: "string",
          topic: "string",
          author: "string",
          created_at: "string",
          article_img_url: "string",
          comment_count: "string",
        };
        articles.forEach((article) => {
          for (const key in articlesSchema) {
            expect(typeof article[key]).not.toBe(undefined);
            expect(articlesSchema[key]).toBe(typeof article[key]);
          }
        });
      });
  });
  test("200: Should sort our articles by created_at in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSorted({ key: "created_at", descending: true });
      });
  });
  test("200: should have optional query parameters to sort by an valid columns in the table such as votes", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSorted({ key: "votes", descending: true });
      });
  });
  test("200: should have optional query parameters to sort by an valid columns in the table such as author, and also an additional paramater for ascending or descending", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order_by=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSorted({ key: "author", descending: false });
      });
  });

  test("200: should be able to take a 'topic' query parameter that will return all articles with the matching topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });

  test("200: should return with a 200 status code and an empty array if a valid topic is inserted as a query parameter, but no articles match it.", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(0);
      });
  });
  test("400: should return with a 400 status code and an error message if a valid topic data type is inserted as a query parameter, but no topics exist matching it.", () => {
    return request(app)
      .get("/api/articles?topic=badtopic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found");
      });
  });

  test("400: should respond with a 400 status code if either or both of the query parameters do not match what is allowed", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order_by=wrong")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: Invalid order_by value");
      });
  });
  test("400: should respond with a 400 status code if either or both of the query parameters do not match what is allowed", () => {
    return request(app)
      .get("/api/articles?sort_by=wrong&order_by=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: Invalid sort_by value");
      });
  });
});
