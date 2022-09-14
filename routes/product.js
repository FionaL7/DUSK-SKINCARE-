const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const catchAsync = require("../utils/catchAsync");
const Cart = require("../models/cart");
const Review = require("../models/review");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const controllers = require("../Controllers/productControl");

router
  .route("/")
  .get(controllers.index)
  .post(upload.array("image"), controllers.addProduct);

router.get("/new", controllers.newProductForm);

router
  .route("/:id")
  .get(catchAsync(controllers.showPage))
  .delete(controllers.deleteProduct);

module.exports = router;
