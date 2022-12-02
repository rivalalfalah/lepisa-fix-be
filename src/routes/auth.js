const express = require("express");
const authRouter = express.Router();
const {isLogin} = require("../middleware/isLogin")
const {
  register,
  updateStatus,
  login,
  logout,
  resetPassword,
  forgotPassword,
} = require("../controllers/auth");

authRouter.post("/register/", register);
authRouter.get("/verify/:key", updateStatus);
authRouter.post("/login", login);
authRouter.delete("/logout", isLogin, logout);
authRouter.patch("/reset-password", resetPassword);
authRouter.post("/forgot-password", forgotPassword);

module.exports = authRouter;
