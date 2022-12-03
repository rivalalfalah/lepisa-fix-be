const db = require("../config/postgre");

const createSubscribe = (req) => {
  return new Promise((resolve, reject) => {
    const { body } = req;
    const { email } = body;
    const timestamp = Date.now() / 1000;
    const getQuery =
      "select email from subscribe where email = $1 and deleted_at is null";
    db.query(getQuery, [email], (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error" });
      }
      if (result.rows[0])
        return reject({ status: 400, msg: "your email have been subscribed" });
      const postQuery =
        "insert into subscribe(email,created_at,updated_at) values($1,to_timestamp($2),to_timestamp($3))";
      db.query(postQuery, [email, timestamp, timestamp], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "internal server error" });
        }
        return resolve({
          status: 201,
          msg: "thankyou for subscribe",
          data: result.rows,
        });
      });
    });
  });
};

const subscribeRepo = {
  createSubscribe,
};

module.exports = subscribeRepo;
