const router = require("express").Router();
const userRoutes = require("./user");
const productRoutes = require("./products");
const transactionRoutes = require("./transactions")
const depositRoutes = require("./deposits")
const orderRoutes = require("./orders")
router.use("/user", userRoutes);
router.use("/products", productRoutes);
router.use("/transaction",transactionRoutes);
router.use("/deposit",depositRoutes);
router.use("/order",orderRoutes);

module.exports = router;