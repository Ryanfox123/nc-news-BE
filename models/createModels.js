const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");
const format = require("pg-format");

exports.createComment = (id, body) => {
  const newBody = [body.body, 0, body.username, id];
  const formattedComment = format(
    `INSERT INTO comments
    (body, votes, author, article_id)
    VALUES %L
    RETURNING *;
    `,
    [newBody]
  );
  return db.query(formattedComment).then((comment) => {
    return comment.rows[0];
  });
};
exports.createArticle = (body) => {
  body.article_image_url =
    body.article_image_url ||
    "https://i.pinimg.com/564x/ed/d5/02/edd502762e217ed59da71d007ec1ff3b.jpg";
  const newBody = [
    body.author,
    body.title,
    body.body,
    body.topic,
    body.article_image_url,
  ];

  const formattedBody = format(
    `
    INSERT INTO articles
    (author, title, body, topic, article_img_url)
    VALUES %L
    RETURNING *;`,
    [newBody]
  );
  return db.query(formattedBody).then((article) => {
    const finalArticle = article.rows[0];
    finalArticle.comment_count = 0;
    return finalArticle;
  });
};
