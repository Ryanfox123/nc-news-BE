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
  let sortByVal = query.sort_by || "created_at";
  let orderByVal = query.order_by || "DESC";
  let topicVal = query.topic;
  const limit = query.limit || 10;
  const page = query.p || 1;
  const lowerLimit = limit * page - limit;

  let argument = 1;
  const whereQuery = [];
  const values = [];

  const validTopics = topics.map((topic) => topic.slug);

  if (topicVal) {
    if (!validTopics.includes(topicVal)) {
      return Promise.reject({ status: 404, msg: "Topic not found" });
    }
    whereQuery.push(`topic = $${argument++}`);
    values.push(topicVal);
  }

  if (
    ![
      "created_at",
      "title",
      "topic",
      "author",
      "votes",
      "comment_count",
    ].includes(sortByVal)
  ) {
    sortByVal = "created_at";
  }

  if (!["ASC", "DESC"].includes(orderByVal.toUpperCase())) {
    orderByVal = "DESC";
  }

  values.push(limit);
  values.push(lowerLimit);

  const myQuery = `
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.article_img_url, articles.votes,
    COUNT(comments.comment_id) AS comment_count, COUNT(*) OVER () as TotalCount
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    ${whereQuery.length > 0 ? `WHERE ${whereQuery.join(" AND ")}` : ""}
    GROUP BY articles.article_id
    ORDER BY ${sortByVal} ${orderByVal}
    LIMIT $${argument++}
    OFFSET $${argument++};`;

  return db.query(myQuery, values).then(({ rows }) => {
    if (rows.length === 0) {
      return [rows, { page: 1, limit, articleTotal: 0 }];
    }
    articleTotal = rows[0].totalcount;
    const finalArticles = rows.map((article) => {
      delete article.totalcount;
      return article;
    });

    return [finalArticles, { page, limit, articleTotal }];
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

exports.fetchUsername = (username) => {
  const regex = /^[A-Za-z][A-Za-z0-9_]{7,29}$/;
  if (!regex.test(username)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(
      `SELECT * FROM users
    WHERE username = $1`,
      [username]
    )
    .then((user) => {
      if (user.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return user.rows[0];
    });
};
