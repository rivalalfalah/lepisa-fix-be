const resHelper = require("../helpers/sendResponse");
const movieRepo = require("../repo/movie");

const createMovie = async (req, res) => {
    try {
      const response = await movieRepo.createMovie(req);
      resHelper.success(res, response.status, response);
    } catch (error) {
      return resHelper.error(res, error.status, error);
    }
  };
const movieControllers = {
    createMovie
}

module.exports = movieControllers