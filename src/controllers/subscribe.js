const resHelper = require("../helpers/sendResponse");
const subscribeRepo = require("../repo/subscribe");

const postSubscribe = async (req, res) => {
  try {
    const response = await subscribeRepo.createSubscribe(req);
    resHelper.success(res, response.status, response);
  } catch (error) {
    return resHelper.error(res, error.status, error);
  }
};

const subscribeControllers = {
  postSubscribe,
};

module.exports = subscribeControllers;
