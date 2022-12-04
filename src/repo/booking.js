const db = require("../config/postgre");
const postgreDb = require("../config/postgre");

const createBooking = (body, payment_id, user_id) => {
  return new Promise((resolve, reject) => {
    console.log(body);
    const query =
      "insert into booking (schedule_id, user_id, total_ticket, time, total_payment, full_name, email, phone_number, payment_method_id, payment_id, booking_date) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id";

    const {
      schedule_id,
      total_ticket,
      time,
      total_payment,
      full_name,
      email,
      phone_number,
      payment_method_id,
      booking_date,
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
        booking_date,
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

const updatePayment = (status, status_ticket, payment_id) => {
  return new Promise((resolve, reject) => {
    const query =
      "update booking set status = $1, status_ticket = $2 where payment_id = $3";

    postgreDb.query(
      query,
      [status, status_ticket, payment_id],
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

const getPointUser = (id) => {
  return new Promise((resolve, reject) => {
    const query = "select point from users where id = $1";

    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const updatePointUser = (id, point) => {
  return new Promise((resolve, reject) => {
    const query = "update users set point = $1 where id = $2";

    postgreDb.query(query, [point, id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};

const getTiketByPaymentId = (req) => {
  return new Promise((resolve, reject) => {
    const { payment_id } = req.params;
    const getQuery =
      `select movies.tittle,extract(day from booking.date),extract(month from booking.date),extract(year from booking.date),booking.time,booking.total_ticket,category.name,schedule.price,seat.seat,category_age.name as age,booking.payment_id from booking inner join schedule on booking.schedule_id = schedule.id inner join movies on schedule.movie_id = movies.id inner join category on movies.category_id = category.id inner join category_age on movies.category_age_id = category_age.id inner join booking_seat on booking.id = booking_seat.booking_id inner join seat on booking_seat.seat_id = seat.id where booking.payment_id = $1`
    db.query(getQuery,[payment_id] ,(error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error" });
      }
      resolve({ status: 200, data: result.rows });
    });
  });
};

const updateStatusTicket = (id, data) => {
  return new Promise((resolve, reject) => {
    console.log("???????",data);
    const query = "update booking set updated_at = $1, status_ticket = $2 where id = $3";
    postgreDb.query(query, [data.updated_at, data.status_ticket, id], (error, result) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(result);
    });
  });
};


const getTiketByBookingId = (id) => {
  return new Promise((resolve, reject) => {
    // const { id } = req.params;
    const getQuery =
      `select booking.id,movies.tittle,schedule.date,category.name,schedule.price,seat.seat,category_age.name as age,booking.payment_id, booking.status_ticket from booking inner join schedule on booking.schedule_id = schedule.id inner join movies on schedule.movie_id = movies.id inner join category on movies.category_id = category.id inner join category_age on movies.category_age_id = category_age.id inner join booking_seat on booking.id = booking_seat.booking_id inner join seat on booking_seat.seat_id = seat.id where booking.id = $1`
    db.query(getQuery,[id] ,(error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error" });
      }
      resolve({ status: 200, data: result.rows });
    });
  });
};
const bookingRepo = {
  createBooking,
  createBookingSeat,
  getPaymentMethod,
  updatePayment,
  getPointUser,
  updatePointUser,
  getTiketByPaymentId,
  updateStatusTicket,
  getTiketByBookingId
};

module.exports = bookingRepo;
