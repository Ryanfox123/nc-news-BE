const express = require("express");
const { getTopics } = require("./controllers/getControllers");
const endpoints = require("./endpoints.json");

const app = express();

app.get("/api", (req, res) => {
  return res.status(200).send({ endpoints: endpoints });
});

app.get("/api/topics", getTopics);

app.use((req, res) => {
  res.status(404).send({ msg: "The requested endpoint does not exist." });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) res.status(err.status).send({ msg: err.msg });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
