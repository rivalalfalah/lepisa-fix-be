const express = require("express");

const authRouter = require("./auth");
const userRouter = require("./user")
const movieRouter = require("../routes/movie");
const bookingRouter = require("../routes/booking");

const mainRouter = express.Router();

const prefix = "/api";

mainRouter.use(`${prefix}/auth`, authRouter);
mainRouter.use(`${prefix}/user`, userRouter);
mainRouter.use(`${prefix}/movie`, movieRouter);
mainRouter.use(`${prefix}/booking`, bookingRouter)

mainRouter.get(`/`, (req, res) => {
  res.json({ msg: "Welcome to ticketiz" });
});

module.exports = mainRouter;
