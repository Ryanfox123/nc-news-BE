const { createComment } = require("../models/createModels");
const { fetchArticleById } = require("../models/fetchModels");

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
      console.log(err);
      next(err);
    });
};
