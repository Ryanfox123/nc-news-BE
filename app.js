const express = require("express");
const apiRouter = require("./routers/api-router");
const errHandler = require("./err-middleware/err-handler");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).send({ msg: "The requested endpoint does not exist." });
});

app.use(errHandler);

module.exports = app;
