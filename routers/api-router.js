const apiRouter = require("express").Router();
const { getTopics } = require("../controllers/getControllers");
const endpoints = require("../endpoints.json");
const articleRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const usersRouter = require("./users-router");

apiRouter.use("/articles", articleRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/users", usersRouter);

apiRouter.get("/", (req, res) => {
  return res.status(200).send({ endpoints: endpoints });
});

apiRouter.get("/topics", getTopics);

module.exports = apiRouter;
