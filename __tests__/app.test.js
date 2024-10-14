const app = require("../app");
const request = require("supertest");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const endpoints = require("../endpoints.json");
const toBeSorted = require("jest-sorted");

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

describe("200 GET /api", () => {
  test("should respond with a 200 status and a JSON object that lists and details all current functional endpoints on my API.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

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
  test("Should sort our articles by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSorted({ key: "created_at", descending: true });
      });
  });
});
