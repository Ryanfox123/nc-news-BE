const express = require("express");
const {
  getTopics,
  getArticleByID,
  getArticles,
  getComments,
  getUsers,
} = require("./controllers/getControllers");
const endpoints = require("./endpoints.json");
const { postComment } = require("./controllers/postControllers");
const { patchArticle } = require("./controllers/patchControllers");
const { deleteComment } = require("./controllers/deleteControllers");

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  return res.status(200).send({ endpoints: endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleByID);

app.patch("/api/articles/:article_id", patchArticle);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.use((req, res) => {
  res.status(404).send({ msg: "The requested endpoint does not exist." });
});
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23503") {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) res.status(err.status).send({ msg: err.msg });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
