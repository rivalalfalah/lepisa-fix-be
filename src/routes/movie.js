const movieRouter = require("express").Router();
const movieController = require("../controllers/movie");
const cloudinary = require("../middlewares/cloudinary");

movieRouter.post("add",cloudinary,movieController.createMovie)

module.exports = movieRouter