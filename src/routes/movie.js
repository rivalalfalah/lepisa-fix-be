const movieRouter = require("express").Router();
const movieController = require("../controllers/movie");
const cloudinary = require("../middleware/cloudinary");
const singleUpload = require("../middleware/uploadSingle");

movieRouter.post("/add", singleUpload, cloudinary, movieController.createMovie);
movieRouter.get("/:id", movieController.getMovieDetail);
movieRouter.post("/schedule", movieController.addSchedule);
movieRouter.get("/", movieController.getMovieDay);
movieRouter.get("/film/:month", movieController.getMovieMonth);

module.exports = movieRouter;
