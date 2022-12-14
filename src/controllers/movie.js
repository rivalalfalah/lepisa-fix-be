const resHelper = require("../helpers/sendResponse");
const movieRepo = require("../repo/movie");

const createMovie = async (req, res) => {
  try {
    console.log(req.file);
    const response = await movieRepo.createMovie(req);
    resHelper.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    return resHelper.error(res, error.status, error);
  }
};

const getMovieDetail = async (req, res) => {
  try {
    const response = await movieRepo.getMovieDetail(req);
    resHelper.success(res, response.status, response);
  } catch (error) {
    return resHelper.error(res, error.status, error);
  }
};

const getMovieDay = async (req, res) => {
  try {
    const response = await movieRepo.getMovieByDay();
    resHelper.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    return resHelper.error(res, error.status, error);
  }
};

const getMovieMonth = async (req, res) => {
  try {
    const response = await movieRepo.getMovieByMonth(req);
    resHelper.success(res, response.status, response);
  } catch (error) {
    console.log(error);
    return resHelper.error(res, error.status, error);
  }
};

const getSchedule = async (req, res) => {
  try {
    const response = await movieRepo.getSchedule(req);
    resHelper.success(res, response.status, response);
  } catch (error) {
    return resHelper.error(res, error.status, error);
  }
};

const addSchedule = async (req, res) => {
  try {
    const response = await movieRepo.addSchedule(req);
    resHelper.success(res, response.status, response);
  } catch (error) {
    return resHelper.error(res, error.status, error);
  }
};

const movieControllers = {
  createMovie,
  getMovieDetail,
  getMovieDay,
  getMovieMonth,
  getSchedule,
  addSchedule
};

module.exports = movieControllers;
