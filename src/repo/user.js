const postgreDb = require("../config/postgre");
// const bcrypt = require("bcrypt");

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select id, role, first_name, last_name, phone_number, email, password, image, status, point, pin_activation, verify_changepwd from users where id = $1";

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

const userRepo = {
  getUserById,
  getUserByEmail,
  getUserByPin,
  register,
  updateStatus,
  insertWhiteListToken,
  checkWhiteListToken,
  deleteWhiteListToken,
};

module.exports = userRepo;
