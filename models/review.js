const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./user");

const reviewSchema = new Schema({
  name: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  body: {
    type: String,
  },
  rating: {
    type: Number,
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
