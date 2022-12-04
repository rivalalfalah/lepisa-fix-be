const express = require("express");
const bookingRouter = express.Router();
const { isLogin } = require("../middleware/isLogin");
const {
  createBooking,
  handlePayment,
  getTiketPayment,
  getTiketBooking,
} = require("../controllers/booking");

bookingRouter.post("/create-booking", isLogin, createBooking);
bookingRouter.post("/handlemidtrans", handlePayment);
bookingRouter.get("/ticket/:payment_id", getTiketPayment);
bookingRouter.get("/ticketbooking/:booking_id" ,getTiketBooking)

module.exports = bookingRouter;
