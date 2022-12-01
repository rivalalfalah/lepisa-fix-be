const db = require("../config/postgre");

const createMovie = (req) => {
  return new Promise((resolve, reject) => {
    const { body } = req;
    const image = req.image;
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
      cinema_id,
      location_id,
      date_start,
      date_end,
      location_detail
    } = body;
    const timeStamp = Date.now() / 1000;
    const addMovieQuery =
      "insert into movies(tittle,catgory,duration_hour,duration_minute,director,release_date,cast,synopsis,image,category_age_id,created_at,updated_at) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,to_timestamp($11),to_timestamp($12)) returning *";
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
      const returning = { ...result.rows[0] };
      const movie_id = returning.id;
      const price = 30000;
      const scheduleQuery =
        "insert into schedule(movie_id,price,cinema_id,location_id,date_start,date_end,location_detal,created_at,updated_at) values($1,$2,$3,$4,$5,$6,$7,to_timestamp($8),to_timestamp($9))";
      const scheduleValue = [
        movie_id,
        price,
        cinema_id,
        location_id,
        date_start,
        date_end,
        location_detail,
        timeStamp,
        timeStamp,
      ];
      db.query(scheduleQuery, scheduleValue, (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 500, msg: "internal server error" });
        }
        return resolve({
          status: 201,
          msg: `${tittle} schedule created`,
          data: result,
        });
      });
    });
  });
};

const movieRepo = {
  createMovie,
};

module.exports = movieRepo;
