const movieRouter = require("express").Router();
const movieController = require("../controllers/movie");
const cloudinary = require("../middleware/cloudinary");

movieRouter.post("add",cloudinary,movieController.createMovie)

module.exports = movieRouter