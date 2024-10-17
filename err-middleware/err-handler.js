const express = require("express");

const errHandler = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23503") {
    return res.status(400).send({ msg: "Bad request" });
  }

  if (err.status && err.msg) {
    return res.status(err.status).send({ msg: err.msg });
  }
  res.status(500).send({ msg: "Internal server error" });
};

module.exports = errHandler;
