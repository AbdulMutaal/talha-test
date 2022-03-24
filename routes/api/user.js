const router = require("express").Router();
const userController = require("../../controllers/userController");
const axios = require("axios");

router.route("/")
    .post(userController.getCustomers)

router.route("/getWallet")
    .post(userController.getWalletDetails)

router.route("/register")
    .post(userController.register);

router.route("/login")
    .post(userController.login);

router.route("/forgot")
    .post(userController.forgot);

router.route("/loadWallet")
    .post(userController.loadWallet)

router.route("/changePassword")
    .post(userController.changePassword)

router.route("/verifyEmail")
    .post(userController.verifyEmail)

router.route("/sendVerificationEmail")
    .post(userController.sendVerificationEmail)



router.route("/delete")
    .post(userController.deleteUser)


module.exports = router;
