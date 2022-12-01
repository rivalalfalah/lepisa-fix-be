const { sendMail } = require("../helpers/mail");
const sendResponse = require("../helpers/sendResponse");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const userRepo = require("../repo/user");

const auth = {
  register: async (req, res) => {
    try {
      // validasi
      let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
      if (regex.test(req.body.email) === false) {
        return sendResponse.response(res, {
          status: 400,
          message: "Format email wrong",
        });
      }
      const checkEmail = await userRepo.getUserByEmailAndPhone(req.body.email);
      if (checkEmail.rows.length > 0) {
        return sendResponse.response(res, {
          status: 400,
          message: "Your email has been registered",
        });
      }

      const passwordHash = await bcrypt.hash(req.body.password, 10);

      const pinActivation = Math.floor(Math.random() * 1000000);
      console.log(pinActivation);

      const setData = {
          email: req.body.email,
        password: passwordHash,
        pinActivation: pinActivation,
      };

      const result = await userRepo.register(setData);

      const setSendEmail = {
        to: req.body.email,
        subject: "Email Verification !",
        name: req.body.firstName,
        template: "verificationEmail.html",
        buttonUrl: `http://localhost:9090/auth/verify/${setData.pinActivation}`,
      };

      const response = await sendMail(setSendEmail);

      console.log("response", response);
      return sendResponse.response(res, {
        status: 200,
        data: {
          ...result.rows[0],
          email: req.body.email,
          verify_pin: pinActivation,
        },
        message: "Registere success! Please check your email to verify your account.",
      });
    } catch (error) {
      console.log(error);
      return sendResponse.response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
};

module.exports = auth;
