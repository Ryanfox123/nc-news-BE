const db = require("../db/connection");
exports.updateArticle = (id, votes) => {
  return db
    .query(
      `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`,
      [votes, id]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return article.rows[0];
    });
};

exports.updateComment = (id, votes) => {
  if (!votes) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: you must provide a request body.",
    });
  }
  return db
    .query(
      `UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *;`,
      [votes, id]
    )
    .then((comment) => {
      if (comment.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return comment.rows[0];
    });
};
