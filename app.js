const express = require("express");
const { getTopics, getArticleByID } = require("./controllers/getControllers");
const endpoints = require("./endpoints.json");

const app = express();

app.get("/api", (req, res) => {
  return res.status(200).send({ endpoints: endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleByID);

app.use((req, res) => {
  res.status(404).send({ msg: "The requested endpoint does not exist." });
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  if (err.status && err.msg) res.status(err.status).send({ msg: err.msg });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
