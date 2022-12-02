const postgreDb = require("../config/postgre");
// const bcrypt = require("bcrypt");

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select id, role, first_name, last_name, phone_number, email, password, image, status, point, pin_activation, verify_changepwd, created_at, updated_at, deleted_at from users where id = $1";

    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = "select * from users where email = $1";

    postgreDb.query(query, [email], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const getUserByPin = (pin) => {
  return new Promise((resolve, reject) => {
    const query = "select * from users where pin_activation = $1";

    postgreDb.query(query, [pin], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const register = (body) => {
  return new Promise((resolve, reject) => {
    const { email, password, pinActivation } = body;

    console.log(body);
    const query =
      "insert into users (email, password, pin_activation) values ($1,$2,$3) returning id";
    postgreDb.query(
      query,
      [email, password, pinActivation],
      (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

const updateStatus = (setData, id) => {
  return new Promise((resolve, reject) => {
    console.log(setData);
    const query =
      " update users set status = $1, pin_activation = $2 where id = $3";
    postgreDb.query(
      query,
      [setData.status, setData.pin_activation, id],
      (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        resolve(result);
      }
    );
  });
};

const insertWhiteListToken = (token) => {
  return new Promise((resolve, reject) => {
    const query = " insert into white_list_token (token)values ($1)";
    postgreDb.query(query, [token], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const checkWhiteListToken = (token) => {
  return new Promise((resolve, reject) => {
    const query = "select * from white_list_token where token = $1";
    postgreDb.query(query, [token], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const deleteWhiteListToken = (token) => {
  return new Promise((resolve, reject) => {
    const query = "delete from white_list_token where token = $1";

    postgreDb.query(query, [token], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const updateOTPUser = (generateOTP, email) => {
  return new Promise((resolve, reject) => {
    const query = "update users set verify_changepwd = $1 where email = $2";
    postgreDb.query(query, [generateOTP, email], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const updateUserByOTP = (password, OTP, email) => {
  return new Promise((resolve, reject) => {
    const query =
      "update users set password = $1, verify_changepwd = $2 where email = $3";

    postgreDb.query(query, [password, OTP, email], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const getUserByOTP = (OTP) => {
  return new Promise((resolve, reject) => {
    const query = "select * from users where verify_changepwd = $1";
    postgreDb.query(query, [OTP], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const updateProfile = (body, id) => {
  return new Promise((resolve, reject) => {
    let query = "update users set ";
    const values = [];
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id = $${idx + 2}`;
        values.push(body[key], id);
        return;
      }
      query += `${key} = $${idx + 1}, `;
      values.push(body[key]);
    });
    //   res.json({ query, values });
    postgreDb
      .query(query, values)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

const updatePassword = (id, password) => {
  return new Promise((resolve, reject) => {
    const query = "update users set password = $1 where id = $2";
    postgreDb.query(query, [password, id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const userRepo = {
  getUserById,
  getUserByEmail,
  getUserByPin,
  register,
  updateStatus,
  insertWhiteListToken,
  checkWhiteListToken,
  deleteWhiteListToken,
  updateOTPUser,
  updateUserByOTP,
  getUserByOTP,
  updateProfile,
  updatePassword,
};

module.exports = userRepo;
