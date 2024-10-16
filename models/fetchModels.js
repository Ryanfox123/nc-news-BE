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
      `SELECT articles.article_id, articles.votes, articles.title, 
      articles.topic, articles.author, articles.body, 
      articles.created_at, articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1 
      GROUP BY articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.article_img_url, articles.votes;`,
      [articleID]
    )
    .then((article) => {
      if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Entry not found" });
      }
      return article.rows[0];
    });
};

exports.fetchArticles = (query, topics) => {
  const {
    topic: topicVal,
    sort_by: sortByVal = "created_at",
    order_by: orderByVal = "DESC",
  } = query;

  const validTopics = topics.map((topic) => topic.slug);
  const validSorts = ["created_at", "title", "topic", "author", "votes"];
  const normalizedOrder = orderByVal.toUpperCase();

  if (normalizedOrder !== "ASC" && normalizedOrder !== "DESC") {
    return Promise.reject({
      status: 400,
      msg: "Bad request: Invalid order_by value",
    });
  }
  if (!validSorts.includes(sortByVal)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: Invalid sort_by value",
    });
  }

  let queryStr = `SELECT 
    articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.article_img_url, articles.votes,
    COUNT(comments.comment_id) AS comment_count 
    FROM articles
    LEFT JOIN comments
    on articles.article_id = comments.article_id
    `;
  let queryArr = [];
  if (topicVal) {
    if (!validTopics.includes(topicVal)) {
      return Promise.reject({ status: 404, msg: "Topic not found" });
    }
    queryStr += ` WHERE topic = $1`;
    queryArr.push(topicVal);
  }

  queryStr += ` GROUP BY articles.article_id, articles.title,articles.topic, articles.author, articles.created_at, articles.article_img_url, articles.votes
  ORDER BY ${sortByVal} ${normalizedOrder}`;

  return db.query(queryStr, queryArr).then(({ rows }) => {
    return rows;
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
