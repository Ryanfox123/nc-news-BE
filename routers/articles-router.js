const {
  getArticleByID,
  getArticles,
  getComments,
} = require("../controllers/getControllers");
const { patchArticle } = require("../controllers/patchControllers");
const { postComment } = require("../controllers/postControllers");

const articleRouter = require("express").Router();

articleRouter.route("/:article_id").get(getArticleByID).patch(patchArticle);

articleRouter.get("/", getArticles);

articleRouter.route("/:article_id/comments").get(getComments).post(postComment);

module.exports = articleRouter;
