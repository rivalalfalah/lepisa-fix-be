const bookingRepo = require("../repo/booking");
const sendResponse = require("../helpers/sendResponse");
const midtransClient = require("midtrans-client");
// const { updatePayment } = require("../repo/booking");

let coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.SERVER_KEY_MIDTRANS,
  clientKey: process.env.CLIENT_KEY_MIDTRANS,
});

const paymentMidtrans = async (total_payment, bank, payment_id) => {
  const parameter = {
    payment_type: "bank_transfer",
    transaction_details: {
      gross_amount: parseInt(total_payment),
      order_id: payment_id,
    },
    bank_transfer: {
      bank: bank,
    },
  };

  return await coreApi.charge(parameter);
};

const bookingController = {
  createBooking: async (req, res) => {
    try {
      const body = req.body;
      // console.log(body);
      const user_id = req.userPayload.id;
      // console.log(user_id);
      const payment_id = `LEPISA-${Math.floor(
        Math.random() * 100000000000000000000
      )}`;

      const booking = await bookingRepo.createBooking(
        body,
        payment_id,
        user_id
      );

      const booking_id = booking.rows[0].id;
      const { seat_item } = req.body;
      let booking_seat = [];
      await Promise.all(
        seat_item.map(async (item) => {
          await bookingRepo.createBookingSeat(item.seat_id, booking_id);
          const temp = {
            booking_id,
            seat_id: item.seat_id,
          };
          booking_seat.push(temp);
        })
      );

      const payment_method = await bookingRepo.getPaymentMethod(
        body.payment_method_id
      );
      // console.log(payment_method.rows[0]);
      const bank = payment_method.rows[0].name;

      const result = {
        id: booking_id,
        user_id,
        booking_seat,
        schedule_id: body.schedule_id,
        booking_date: body.booking_date,
        time: body.time,
        total_ticket: body.total_ticket,
        total_payment: body.total_paymnet,
        full_name: body.full_name,
        email: body.email,
        phone_number: body.phone_number,
        payment_method_id: bank,
        payment_id,
      };

      const cekPoint = await bookingRepo.getPointUser(user_id);
      const point = cekPoint.rows[0].point;
      // console.log(point);

      const updatePoint = point + body.total_ticket * 50;
      // console.log(updatePoint);
      await bookingRepo.updatePointUser(user_id, updatePoint);

      const midtrans = await paymentMidtrans(
        body.total_payment,
        bank,
        payment_id
      );

      return sendResponse.response(res, {
        status: 200,
        data: { result, midtrans },
        message: "Booking success.",
      });
    } catch (error) {
      console.log(error);
      return sendResponse.response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },

  handlePayment: async (req, res) => {
    const { order_id, transaction_status } = req.body;
    try {
      const status = transaction_status;
      const status_ticket = "Active";
      const payment_id = order_id;
      const result = await bookingRepo.updatePayment(
        status,
        status_ticket,
        payment_id
      );

      return sendResponse.response(res, {
        status: 200,
        data: result,
        message: "Transaction success.",
      });
    } catch (error) {
      console.log(error);
      return sendResponse.response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },

  getTiketPayment: async (req, res) => {
    try {
      const response = await bookingRepo.getTiketByPaymentId(req);
      sendResponse.success(res, response.status, response);
    } catch (error) {
      console.log(error);
      sendResponse.error(res, error.status, error);
    }
  },

  getTiketBooking: async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      const response = await bookingRepo.getTiketByBookingId(id);
      console.log(response.data);
      sendResponse.success(res, response.status, response);
    } catch (error) {
      console.log(error);
      sendResponse.error(res, error.status, error);
    }
  },

  updateStatusTicket: async (req, res) => {
    try {
      const { id } = req.params;
      const checkBooking = await bookingRepo.getTiketByBookingId(id);
      console.log(">>>>>>>>", checkBooking.data.length);

      if (checkBooking.data.length < 1) {
        return sendResponse.response(res, {
          status: 404,
          message: "Data not found",
        });
      }

      const setData = {
        status_ticket: "Used",
        updated_at: new Date(Date.now()),
      };

      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await bookingRepo.updateStatusTicket(id, setData);

      return sendResponse.response(res, {
        status: 200,
        data: result.rows,
        message: "Success use ticket!",
      });
    } catch (error) {
      console.log(error);
      return sendResponse.response(res, {
        error,
        status: 500,
        message: "Internal server error",
      });
    }
  },
};

module.exports = bookingController;
