const express = require("express");
const userRouter = express.Router();
const { isLogin } = require("../middleware/isLogin");
const cloudinary = require("../middleware/cloudinary");
const singleUpload = require("../middleware/uploadSingle");
const validate = require("../middleware/validate");
const {
  getUserById,
  updateProfile,
  updatePassword,
} = require("../controllers/user");

userRouter.get("/profile", isLogin, getUserById);
userRouter.patch(
  "/profile/update",
  isLogin,
  singleUpload,
  cloudinary,
  validate.patchBody(
    "image",
    "first_name",
    "last_name",
    "email",
    "phone_number"
  ),
  updateProfile
);
userRouter.patch("/password", isLogin, updatePassword);

module.exports = userRouter;
