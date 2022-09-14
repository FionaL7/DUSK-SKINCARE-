const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");
const Cart = require("./cart");
const Address = require("./address");
const { request } = require("express");
const Payment = require("./payment");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
  },
  addresses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
  ],
  payments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
  ],
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
