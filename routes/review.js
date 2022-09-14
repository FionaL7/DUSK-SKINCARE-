const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const Product = require("../models/product");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn } = require("../middleware");

router.post(
  "/",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    const review = await new Review(req.body.review);
    review.name = req.user._id;
    await product.reviews.push(review);
    await product.save();
    await review.save();
    res.redirect(`/product/${product._id}`);
  })
);

module.exports = router;
