const db = require("../config/postgre");

const createMovie = (req) => {
  return new Promise((resolve, reject) => {
    const { body } = req;
    console.log(req.file);
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
    const addMovieQuery = `insert into movies(tittle,category,duration_hour,duration_minute,director,release_date,"cast",synopsis,image,category_age_id,created_at,update_at) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,to_timestamp($11),to_timestamp($12)) returning *`;
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

const movieRepo = {
  createMovie,
};

module.exports = movieRepo;
