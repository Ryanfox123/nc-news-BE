const { getUsers } = require("../controllers/getControllers");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);

module.exports = usersRouter;
