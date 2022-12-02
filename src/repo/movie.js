const db = require("../config/postgre");

const createMovie = (req) => {
  return new Promise((resolve, reject) => {
    const { body } = req;
    const image = req.file.secure_url;
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
      return resolve({ status: 201, msg: "movies created", result });
    });
  });
};

const getMovieDetail = (req) => {
  const { id } = req.params;
  return new Promise((resolve, reject) => {
    const getMovieQuery =
      "select movies.tittle,category.name,movies.duration_hour,movies.duration_minute,movies.director,movies.release_date,movies.cast_name,movies.synopsis,category_age.name,movies.image from movies inner join category on movies.category_id = category.id inner join category_age on category_age.id = movies.category_age_id where movies.id = $1";
    db.query(getMovieQuery, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "internal server error" });
      }

      if (!result.rows[0]) {
        return reject({ status: 404,msg:"data not found" });
      }
      console.log(result.rows[0]);
      return resolve({ status: 200, data: result.rows[0] });
    });
  });
};

const movieRepo = {
  createMovie,
  getMovieDetail,
};

module.exports = movieRepo;
