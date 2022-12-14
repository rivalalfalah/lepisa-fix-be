const movieRouter = require("express").Router();
const movieController = require("../controllers/movie");
const cloudinary = require("../middleware/cloudinary");
const singleUpload = require("../middleware/uploadSingle");

movieRouter.post("/add", singleUpload, cloudinary, movieController.createMovie);
movieRouter.get("/:id", movieController.getMovieDetail);
movieRouter.get("/", movieController.getMovieDay);
movieRouter.get("/film/:month", movieController.getMovieMonth);
movieRouter.get("/schedule/:movie", movieController.getSchedule);
movieRouter.post("/add/schedule", movieController.addSchedule);

module.exports = movieRouter;
