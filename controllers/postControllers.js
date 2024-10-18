const { createComment, createArticle } = require("../models/createModels");
const { fetchArticleById, fetchTopics } = require("../models/fetchModels");

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;

  const promises = [
    fetchArticleById(article_id),
    createComment(article_id, body),
  ];

  Promise.all(promises)
    .then((results) => {
      const comment = results[0];
      res.status(200).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (req, res, next) => {
  const body = req.body;
  createArticle(body)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      console.log(err);
      if (err.constraint === "articles_topic_fkey") {
        err = {
          status: 404,
          msg: "Article does not exist: please post to an existant article",
        };
      }
      if (err.constraint === "articles_author_fkey") {
        err = {
          status: 404,
          msg: "This user does not exist: please post from an existing user",
        };
      }
      next(err);
    });
};
