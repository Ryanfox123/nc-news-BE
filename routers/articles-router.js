const {
  getArticleByID,
  getArticles,
  getComments,
} = require("../controllers/getControllers");
const { patchArticle } = require("../controllers/patchControllers");
const { postComment, postArticle } = require("../controllers/postControllers");

const articleRouter = require("express").Router();

articleRouter.route("/:article_id").get(getArticleByID).patch(patchArticle);

articleRouter.route("/").get(getArticles).post(postArticle);

articleRouter.route("/:article_id/comments").get(getComments).post(postComment);

module.exports = articleRouter;
