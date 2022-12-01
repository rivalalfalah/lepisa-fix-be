const express = require("express");

const authRouter = require("./auth");

const movieRouter = require("../routes/movie");

const mainRouter = express.Router();

const prefix = "/api";

mainRouter.use(`${prefix}/auth`, authRouter)
mainRouter.use(`${prefix}/movie`, movieRouter);

mainRouter.get(`/`, (req, res) => {
  res.json({ msg: "Welcome to ticketiz" });
});

module.exports = mainRouter;
