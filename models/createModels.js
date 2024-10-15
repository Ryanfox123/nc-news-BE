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
