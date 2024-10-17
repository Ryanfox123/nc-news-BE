const { getUsers, getUsername } = require("../controllers/getControllers");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUsername);

module.exports = usersRouter;
