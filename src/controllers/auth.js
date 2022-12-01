const { sendMail } = require("../helpers/mail");
const sendResponse = require("../helpers/sendResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepo = require("../repo/user");
const redis = require("../config/redis")

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
      const checkEmail = await userRepo.getUserByEmail(req.body.email);
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
        name: req.body.first_name,
        template: "verificationEmail.html",
        buttonUrl: `http://localhost:8080/auth/verify/${setData.pinActivation}`,
      };

      const response = await sendMail(setSendEmail);

      console.log("response", response);
      return sendResponse.response(res, {
        status: 200,
        data: {
          ...result.rows[0],
          email: req.body.email,
          // verify_pin: pinActivation,
        },
        message:
          "Register success! Please check your email to verify your account.",
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

  updateStatus: async (req, res) => {
    try {
      const { key } = req.params;
      console.log("key", key);
      const checkPin = await userRepo.getUserByPin(key);

      console.log(">>>>>", checkPin.rows);
      if (checkPin.rows.length === 0) {
        return sendResponse.response(res, {
          status: 404,
          message: "User not found",
        });
      }

      const id = checkPin.rows[0].id;
      // console.log(id);
      const setData = {
        status: "active",
        pin_activation: null,
      };

      await userRepo.updateStatus(setData, id);
      return sendResponse.response(res, {
        status: 200,
        message: "Success! Active account.",
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

  login: async (req, res) => {
    try {
      // validasi
      let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
      if (regex.test(req.body.email) === false) {
        return sendResponse.response(res, {
          status: 400,
          message: "Format email is wrong",
        });
      }
      const checkEmail = await userRepo.getUserByEmail(req.body.email);
      if (checkEmail.rows.length === 0) {
        return sendResponse.response(res, {
          status: 400,
          message: "Your email has been registered",
        });
      }
      console.log("cek email", checkEmail);
      const hashedPassword = checkEmail.rows[0].password;
      const checkPassword = await bcrypt.compare(
        req.body.password,
        hashedPassword
      );
      console.log("cek password", checkPassword);

      if (checkPassword === false) {
        return sendResponse.response(res, {
          status: 401,
          message: "Email is wrong.",
        });
      }

      const payload = {
        id: checkEmail.rows[0].id,
        name: checkEmail.rows[0].email,
        role: checkEmail.rows[0].role,
      };

      const token = await jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "240h",
        issuer: process.env.ISSUER,
      });

      await userRepo.insertWhiteListToken(token);
      const test = await redis.setEx(
        `getToken: ${payload.id}`,
        10 * 24 * 60 * 60,
        token
      );
      console.log(test);
      return sendResponse.response(res, {
        status: 200,
        data: { name: payload.email, role: payload.role, token, test },
        message: "Login success",
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

  logout: async (req, res) => {
    try {
      const id = req.userPayload.id;
      console.log(id);
      const token = req.header("x-access-token");

      const user = await userRepo.deleteWhiteListToken(token);
      const test = await redis.del(`getToken: ${id}`);
      sendResponse.response(res, { status: 200, data: test, message: "Logout success" });


    } catch (error) {
      console.log(error);
      return sendResponse.response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  }
};

module.exports = auth;
