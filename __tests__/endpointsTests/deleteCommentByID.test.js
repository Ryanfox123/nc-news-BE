const app = require("../../app");
const request = require("supertest");
const data = require("../../db/data/test-data/index.js");
const db = require("../../db/connection.js");
const seed = require("../../db/seeds/seed.js");

beforeEach(() => seed(data));
afterAll(() => db.end());

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
