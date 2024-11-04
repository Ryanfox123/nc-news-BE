const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchComments,
  fetchUsers,
  fetchUsername,
} = require("../models/fetchModels");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const query = req.query;
  fetchTopics()
    .then((topics) => {
      return fetchArticles(query, topics);
    })
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(() => {
      return fetchComments(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUsername(username)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
};
