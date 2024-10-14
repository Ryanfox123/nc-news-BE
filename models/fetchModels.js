const db = require("../db/connection.js");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((topics) => {
    if (topics.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return topics.rows;
  });
};

exports.fetchArticleById = (articleID) => {
  return db
    .query(
      `SELECT * FROM articles
        WHERE article_id = $1`,
      [articleID]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Entry not found" });
      }
      return article.rows[0];
    });
};
