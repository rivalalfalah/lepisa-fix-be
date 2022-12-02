const userRepo = require("../repo/user");
const sendResponse = require("../helpers/sendResponse");
const bcrypt = require("bcrypt");

const userController = {
  getUserById: async (req, res) => {
    try {
      console.log(req.userPayload);
      const id = req.userPayload.id;
      const result = await userRepo.getUserById(id);
      return sendResponse.response(res, {
        status: 200,
        data: result.rows[0],
        message: "Get user by id success",
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

  updateProfile: async (req, res) => {
    try {
      const id = req.userPayload.id;
      let body = req.body;
      console.log(req.file);
      if (req.file) {
        const image = `${req.file.secure_url}`;
        body = { ...body, image };
      }
      await userRepo.updateProfile(body, id);
      return sendResponse.response(res, {
        status: 200,
        data: { id, ...body },
        message: "Edit profile success",
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

  updatePassword: async (req, res) => {
    const id = req.userPayload.id;
    const { old_password, new_password, confirm_password } = req.body;
    try {
      const checkPassword = await userRepo.getUserById(id);

      const isValid = await bcrypt.compare(
        old_password,
        checkPassword.rows[0].password
      );
    //   console.log(">>>>>>", isValid);

      if (isValid === false) {
        return sendResponse.response(res, {
          status: 403,
          message: "Wrong password!",
        });
      }

      if (new_password !== confirm_password) {
        return sendResponse.response(res, {
          status: 403,
          message: "Your password doesn't match!",
        });
      }

      const isSame = await bcrypt.compare(
        new_password,
        checkPassword.rows[0].password
      );
    //   console.log(isSame);

      if (isSame === true) {
        return sendResponse.response(res, {
          status: 403,
          message: "New password can't be the same as old password!",
        });
      }

      const password = await bcrypt.hash(new_password, 10);

      await userRepo.updatePassword(id, password);
      return sendResponse.response(res, {
        status: 200,
        message: "Password has been changed.",
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

module.exports = userController;
