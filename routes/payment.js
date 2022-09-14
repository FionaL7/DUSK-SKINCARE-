const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Cart = require("../models/cart");
const Address = require("../models/address");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn } = require("../middleware");
const controllers = require("../Controllers/paymentControl");

router.get("/billing", isLoggedIn, catchAsync(controllers.billingForm));
router.get("/payment", isLoggedIn, catchAsync(controllers.submitPayment));
router.get("/verify", isLoggedIn, catchAsync(controllers.verifyPayment));
router.post("/orders", isLoggedIn, catchAsync(controllers.orderSuccess));

module.exports = router;
