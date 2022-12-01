const express = require("express");

const movieRouter = require("../routes/movie");
const mainRouter = express.Router()

const prefix = "/api";

mainRouter.use(`${prefix}/movie`, movieRouter);

mainRouter.get(`/`, (req, res) => {
  res.json({ msg: "Welcome" });
});

module.exports = mainRouter;
