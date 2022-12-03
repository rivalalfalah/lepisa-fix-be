const subscribeRouter = require("express").Router();
const subscribeController = require("../controllers/subscribe");

subscribeRouter.post("/", subscribeController.postSubscribe);

module.exports = subscribeRouter;
