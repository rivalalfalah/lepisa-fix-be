const express = require("express");
const authRouter = express.Router();
const { register, updateStatus, login, logout } = require("../controllers/auth");

authRouter.post("/register/", register);
authRouter.get("/verify/:key", updateStatus);
authRouter.post("/login", login);
authRouter.delete("/logout", logout)

module.exports = authRouter;
