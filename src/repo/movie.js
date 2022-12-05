const db = require("../config/postgre");

const createMovie = (req) => {
  return new Promise((resolve, reject) => {
    const { body } = req;
    console.log(req.file);
    const image = req.file.url;
    const {
      tittle,
      category,
      duration_hour,
      duration_minute,
      director,
      release_date,
      cast,
      synopsis,
      category_age,
    } = body;
    const timeStamp = Date.now() / 1000;
    const addMovieQuery = `insert into movies(tittle,category_id,duration_hour,duration_minute,director,release_date,cast_name,synopsis,image,category_age_id,created_at,update_at) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,to_timestamp($11),to_timestamp($12)) returning id`;
    const addMovieValue = [
      tittle,
      category,
      duration_hour,
      duration_minute,
      director,
      release_date,
      cast,
      synopsis,
      image,
      category_age,
      timeStamp,
      timeStamp,
    ];
    db.query(addMovieQuery, addMovieValue, (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "Internal Server Error" });
      }
      const movieId = result.rows[0].id;
      const { location, date, time, price } = body;
      const addScheduleQuery = `insert into schedule(movie_id,location_id,date,time,price,created_at,updated_at) values($1,$2,$3,array[${time}],$4,to_timestamp($5),to_timestamp($6)) returning *`;
      const addScheduleValues = [
        movieId,
        location,
        date,
        price,
        timeStamp,
        timeStamp,
      ];
      db.query(addScheduleQuery, addScheduleValues, (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "internal server error", error });
        }
        return resolve({
          status: 201,
          msg: "movies created",
          data: result.rows[0],
        });
      });
    });
  });
};

const getMovieDetail = (req) => {
  const { id } = req.params;
  return new Promise((resolve, reject) => {
    const getMovieQuery =
      "select movies.tittle,category.name as category,movies.duration_hour,movies.duration_minute,movies.director,extract(day from movies.release_date) as day,extract(month from release_date) as month,extract(year from movies.release_date) as year,movies.cast_name,movies.synopsis,category_age.name,movies.image from movies inner join category on movies.category_id = category.id inner join category_age on category_age.id = movies.category_age_id where movies.id = $1 and movies.deleted_at is null";
    db.query(getMovieQuery, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error" });
      }

      if (!result.rows[0]) {
        return reject({ status: 404, msg: "data not found" });
      }
      console.log(result.rows[0]);
      return resolve({ status: 200, data: result.rows[0] });
    });
  });
};

const getMovieByDay = () => {
  return new Promise((resolve, reject) => {
    const getQuery =
      "select movies.id,movies.tittle,movies.image,category.name,extract(day from movies.release_date) as day,extract(month from release_date) as month,extract(year from movies.release_date) as year from movies inner join category on movies.category_id = category.id where extract(year from now()) = extract(year from movies.release_date) and extract(month from now()) = extract(month from movies.release_date) ";
    db.query(getQuery, (error, result) => {
      if (error) {
        console.log(error);
        return reject({
          status: 500,
          msg: "internal server error",
          error,
        });
      }
      return resolve({ status: 200, data: result.rows });
    });
  });
};

const getMovieByMonth = (req) => {
  return new Promise((resolve, reject) => {
    const { month } = req.params;
    const getQuery =
      "select movies.id,movies.tittle,movies.image,category.name,extract(day from movies.release_date) as day_release,extract(month from movies.release_date) as month_release,extract(year from movies.release_date) as year_release from movies inner join category on movies.category_id = category.id where extract(month from movies.release_date)  = $1 and  extract(year from now()) < extract(year from movies.release_date) ";
    db.query(getQuery, [month], (error, result) => {
      if (error) {
        console.log(error);
        return reject({
          status: 500,
          msg: "internal server error",
          error,
        });
      }
      return resolve({ status: 200, data: result.rows });
    });
  });
};

const getSchedule = (req) => {
  return new Promise((resolve, reject) => {
    const { movie } = req.params;
    let getQuery = `select schedule.id as id,extract(day from schedule.date) as day,extract(month from schedule.date) as month,extract(year from schedule.date) as year,movies.tittle,cinema.name,cinema.image,schedule.time,schedule.price,address.address_name from schedule inner join movies on movies.id = schedule.movie_id inner join location on schedule.location_id = location.id inner join cinema on location.cinema_id = cinema.id inner join address on address.id = location.address_id where movies.id = $1`;
    if (req.query.date && req.query.location) {
      const date = req.query.date;
      const location = req.query.location;
      getQuery += `and schedule.date = $2 and address.city_id = $3`;
      db.query(getQuery, [movie, date, location], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "internal server error" });
        }
        return resolve({ status: 200, data: result.rows });
      });
    }
    if (req.query.date) {
      const date = req.query.date;
      getQuery += `and schedule.date = $2`;
      db.query(getQuery, [movie, date], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "internal server error" });
        }
        return resolve({ status: 200, data: result.rows });
      });
    }
    if (req.query.location) {
      const location = req.query.location;
      getQuery += `and address.city_id = $2`;
      db.query(getQuery, [movie, location], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "internal server error" });
        }
        return resolve({ status: 200, data: result.rows });
      });
    }
    db.query(getQuery, [movie], (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error" });
      }
      return resolve({ status: 200, data: result.rows });
    });
  });
};

const addSchedule = (req) => {
  return new Promise((resolve, reject) => {
    const { body } = req;
    const { movie, location, date, time, price } = body;
    const timeStamp = Date.now() / 1000;
    const addScheduleQuery = `insert into schedule(movie_id,location_id,date,time,price,created_at,updated_at) values($1,$2,$3,array[${time}],$4,to_timestamp($5),to_timestamp($6)) returning *`;
    const addScheduleValues = [
      movie,
      location,
      date,
      price,
      timeStamp,
      timeStamp,
    ];
    db.query(addScheduleQuery, addScheduleValues, (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error", error });
      }
      return resolve({
        status: 201,
        msg: "schedule created",
        data: result.rows[0],
      });
    });
  });
};

const movieRepo = {
  createMovie,
  getMovieDetail,
  getMovieByDay,
  getMovieByMonth,
  getSchedule,
  addSchedule,
};

module.exports = movieRepo;
