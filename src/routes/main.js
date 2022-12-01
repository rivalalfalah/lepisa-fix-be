const express = require("express");

const authRouter = require("./auth");

const mainRouter = express.Router();

const prefix = "/api";

mainRouter.use(`${prefix}/auth`, authRouter)

mainRouter.get(`/`, (req, res) => {
  res.json({ msg: "Welcome" });
});

module.exports = mainRouter;
