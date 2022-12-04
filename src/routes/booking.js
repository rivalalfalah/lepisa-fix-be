const express = require("express");
const bookingRouter = express.Router();
const { isLogin } = require("../middleware/isLogin");
const {
  createBooking,
  handlePayment,
  getTiketPayment,
  getTiketBooking,
  updateStatusTicket,
  getHistory,
} = require("../controllers/booking");

bookingRouter.post("/create-booking", isLogin, createBooking);
bookingRouter.post("/handlemidtrans", handlePayment);
bookingRouter.get("/ticket/:payment_id", getTiketPayment);
bookingRouter.get("/ticketbooking/:id", getTiketBooking);
bookingRouter.patch("/status-ticket/:id", updateStatusTicket);
bookingRouter.get("/history", isLogin, getHistory);

module.exports = bookingRouter;
