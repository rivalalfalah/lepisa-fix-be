const express = require("express");
const bookingRouter = express.Router();
const { isLogin } = require("../middleware/isLogin");
const { createBooking, handlePayment } = require("../controllers/booking");

bookingRouter.post("/create-booking", isLogin, createBooking);
bookingRouter.post("/handlemidtrans", handlePayment);

module.exports = bookingRouter;
