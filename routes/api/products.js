const router = require("express").Router();
const productsController = require("../../controllers/productsController");
const axios = require("axios");

router.route("/")
    .get(productsController.getAllProducts);


module.exports = router;
