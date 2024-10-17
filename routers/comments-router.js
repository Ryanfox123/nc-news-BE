const { deleteComment } = require("../controllers/deleteControllers");
const { patchComment } = require("../controllers/patchControllers");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").delete(deleteComment).patch(patchComment);

module.exports = commentsRouter;
