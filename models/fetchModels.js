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

exports.fetchArticles = (query) => {
  const sortByVal = query.sort_by || "created_at";
  let orderByVal = query.order_by || "DESC";
  orderByVal = orderByVal.toUpperCase();
  const validSorts = ["created_at", "title", "topic", "author", "votes"];

  if (orderByVal !== "ASC" && orderByVal !== "DESC") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (!validSorts.includes(sortByVal)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryStr = `SELECT 
    articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.article_img_url, articles.votes,
    COUNT(comments.comment_id) AS comment_count 
    FROM articles
    LEFT JOIN comments
    on articles.article_id = comments.article_id
    GROUP BY articles.article_id, articles.title,articles.topic, articles.author, articles.created_at, articles.article_img_url, articles.votes
    `;
  queryStr += ` ORDER BY ${sortByVal}`;
  queryStr += ` ${orderByVal}`;
  return db.query(queryStr).then((articles) => {
    if (articles.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return articles.rows;
  });
};

exports.fetchComments = (articleID) => {
  return db
    .query(
      `SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC`,
      [articleID]
    )
    .then((comments) => {
      if (comments.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return comments.rows;
    });
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then((users) => {
    if (users.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "User not found" });
    }
    return users.rows;
  });
};
