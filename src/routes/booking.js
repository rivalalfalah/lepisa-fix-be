const express = require("express");
const bookingRouter = express.Router();
const { isLogin } = require("../middleware/isLogin");
const {
  createBooking,
  handlePayment,
  getTiket,
} = require("../controllers/booking");

bookingRouter.post("/create-booking", isLogin, createBooking);
bookingRouter.post("/handlemidtrans", handlePayment);
bookingRouter.get("/ticket/:payment_id", getTiket);

module.exports = bookingRouter;
