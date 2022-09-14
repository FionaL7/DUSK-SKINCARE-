const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./user");
const Review = require("./review");

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  inStock: {
    type: Number,
    required: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
