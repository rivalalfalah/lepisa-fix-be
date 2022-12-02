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
    const addMovieQuery = `insert into movies(tittle,category_id,duration_hour,duration_minute,director,release_date,cast_name,synopsis,image,category_age_id,created_at,update_at) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,to_timestamp($11),to_timestamp($12)) returning *`;
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
      return resolve({
        status: 201,
        msg: "movies created",
        data: result.rows[0],
      });
    });
  });
};

const getMovieDetail = (req) => {
  const { id } = req.params;
  return new Promise((resolve, reject) => {
    const getMovieQuery =
      "select movies.tittle,category.name,movies.duration_hour,movies.duration_minute,movies.director,extract(day from movies.release_date) as day,extract(month from release_date) as month,extract(year from movies.release_date) as year,movies.cast_name,movies.synopsis,category_age.name,movies.image from movies inner join category on movies.category_id = category.id inner join category_age on category_age.id = movies.category_age_id where movies.id = $1 and movies.deleted_at is null";
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
      "select movies.tittle,movies.image,category.name,extract(day from movies.release_date) as day,extract(month from release_date) as month,extract(year from movies.release_date) as year from movies inner join category on movies.category_id = category.id where extract(year from now()) = extract(year from movies.release_date) and extract(month from now()) = extract(month from movies.release_date) ";
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

const addSchedule = (req) => {
  return new Promise((resolve, reject) => {
    const { body } = req;
    const { movie, cinema, location, date } = body;
    const timestamp = Date.now() / 1000;
    const addScheduleQuery = `insert into schedule(movie_id,cinema_id,location_id,date,created_at,updated_at) values($1,$2,$3,$4,to_timestamp($5),to_timestamp($6)) returning *`;
    const addScheduleValues = [
      movie,
      cinema,
      location,
      date,
      timestamp,
      timestamp,
    ];
    db.query(addScheduleQuery, addScheduleValues, (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error", error });
      }
      return resolve({ status: 201, data: result });
    });
  });
};

const getMovieByMonth = (req) => {
  return new Promise((resolve, reject) => {
    const { month } = req.params;
    const getQuery =
      "select movies.tittle,movies.image,category.name,extract(day from movies.release_date) as day_release,extract(month from movies.release_date) as month_release,extract(year from movies.release_date) as year_release from movies inner join category on movies.category_id = category.id where extract(month from movies.release_date)  = $1 and  extract(year from now()) < extract(year from movies.release_date) limit 5";
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

const movieRepo = {
  createMovie,
  getMovieDetail,
  getMovieByDay,
  addSchedule,
  getMovieByMonth,
};

module.exports = movieRepo;
