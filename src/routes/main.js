const express = require("express");

mainRouter.use(`${prefix}/movie`, movieRouter);
const authRouter = require("./auth");

const movieRouter = require("../routes/movie");

const mainRouter = express.Router();

const prefix = "/api";

mainRouter.use(`${prefix}/auth`, authRouter)

mainRouter.get(`/`, (req, res) => {
  res.json({ msg: "Welcome" });
});

module.exports = mainRouter;
