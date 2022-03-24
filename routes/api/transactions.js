const router = require("express").Router();
const transactionController = require("../../controllers/transactionController");
const axios = require("axios");

router.route("/placeOrder")
    .post(transactionController.placeOrder);
router.route("/getOrders")
.post(transactionController.getOrders);

router.route("/addBalance")
    .post(transactionController.addBalance)


module.exports = router;
