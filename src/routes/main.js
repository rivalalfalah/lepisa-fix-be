const express = require("express");

const mainRouter = express.Router();
// const movieRouter = require("../routes/movie");

const prefix = "/api";

// mainRouter.use(`${prefix}/movie`, movieRouter);

mainRouter.get(`/`, (req, res) => {
  res.json({ msg: "Welcome" });
});

module.exports = mainRouter;
