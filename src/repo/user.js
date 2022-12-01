const postgreDb = require("../config/postgre");
// const bcrypt = require("bcrypt");

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select id, role, firstName, lastName, phoneNumber, email, password, image, point from users where id = $1";

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

const updateStatus = (status, id) => {
  return new Promise((resolve, reject) => {
    const query = " update users set status = $1 where id = $2";
    postgreDb.query(query, [status, id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    })
  });
};

const userRepo = {
  getUserById,
  getUserByEmail,
  register,
  updateStatus,
};

module.exports = userRepo;
