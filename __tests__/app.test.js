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
  test("400: should respond with a 400 status code if either or both of the query parameters do not match what is allowed", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order_by=wrong")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: should respond with a 400 status code if either or both of the query parameters do not match what is allowed", () => {
    return request(app)
      .get("/api/articles?sort_by=wrong&order_by=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

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
        expect(body.msg).toBe("Not found");
      });
  });
});

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
  test("200: should patch the article via article ID, decreasing its votes property by the amount passed in by the body if the number is negative", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -5 })
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.votes).toBe(95);
      });
  });
  test("400: should give an error if an invalid value is passed into our inc_votes property", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "hi" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: should give an error if an invalid value type is passed into our parametric endpoint for article_id", () => {
    return request(app)
      .patch("/api/articles/hello")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: should give an error if a valid value type is passed into our parametric endpoint for article_id but it doesnt match any existing article, giving us a bad request msg", () => {
    return request(app)
      .patch("/api/articles/100")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Should remove a comment from our database by providing the comment_id of the comment we intend to remove.", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((response) => {
        expect(response.statusCode).toBe(204);
      });
  });
  test("404: Should return an error when attempting to delete a comment with a valid comment_id type, but doesnt exist", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then((response) => {
        expect(response.statusCode).toBe(404);
      });
  });
  test("400: Should return an error when attempting to delete a comment with a invalid comment_id type", () => {
    return request(app)
      .delete("/api/comments/hello")
      .expect(400)
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users/", () => {
  test("Upon success should return a 200 code and an array of all users in my database", () => {
    return request(app)
      .get("/api/users/")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(Array.isArray(users)).toBe(true);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
