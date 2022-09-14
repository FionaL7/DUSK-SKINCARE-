const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const addressSchema = require("../schema.js");
const { isLoggedIn } = require("../middleware");
const mongoose = require("mongoose");
const controllers = require("../Controllers/cartControl");

router.post("/add-to-cart", isLoggedIn, catchAsync(controllers.addToCart));

router.get("/cart", isLoggedIn, controllers.getCart);

router
  .route("/checkout", isLoggedIn)
  .get(isLoggedIn, controllers.addressForm)
  .post(isLoggedIn, catchAsync(controllers.submitAddress));

router.delete("/cart/:id", catchAsync(controllers.deleteFromCart));

module.exports = router;
