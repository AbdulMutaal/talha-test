const router = require("express").Router();

const axios = require("axios");
const depositsController = require("../../controllers/depositsController");

router.route("/balance")
    .post(depositsController.depositBalance);


module.exports = router;
