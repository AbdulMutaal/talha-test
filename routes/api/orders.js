const router = require("express").Router();
const transactionController = require("../../controllers/transactionController");
const ordersController = require("../../controllers/orderController")
const axios = require("axios");

router.route("/")
      .post(ordersController.getOrders);

router.route("/create")
    .post(ordersController.createOrder);



router.route("/refund")
    .post(ordersController.refundOrder);



module.exports = router;
