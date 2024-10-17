const { deleteComment } = require("../controllers/deleteControllers");

const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;
