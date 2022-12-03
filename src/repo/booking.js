const postgreDb = require("../config/postgre");

const createBooking = (body, payment_id, user_id) => {
  return new Promise((resolve, reject) => {
    console.log(body);
    const query =
      "insert into booking (schedule_id, user_id, total_ticket, time, total_payment, full_name, email, phone_number, payment_method_id, payment_id) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning id";

    const {
      schedule_id,
      total_ticket,
      time,
      total_payment,
      full_name,
      email,
      phone_number,
      payment_method_id,
    } = body;
    postgreDb.query(
      query,
      [
        schedule_id,
        user_id,
        total_ticket,
        time,
        total_payment,
        full_name,
        email,
        phone_number,
        payment_method_id,
        payment_id,
      ],
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

const createBookingSeat = (seat_id, booking_id) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into booking_seat (booking_id, seat_id) values ($1,$2)";

    postgreDb.query(query, [booking_id, seat_id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const getPaymentMethod = (id) => {
  return new Promise((resolve, reject) => {
    const query = "select * from payment_method where id = $1";

    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const updatePayment = (status, payment_id) => {
  return new Promise((resolve, reject) => {
    const query = "update booking set status = $1 where payment_id = $2";

    postgreDb.query(query, [status, payment_id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const bookingRepo = {
  createBooking,
  createBookingSeat,
  getPaymentMethod,
  updatePayment
};

module.exports = bookingRepo;
