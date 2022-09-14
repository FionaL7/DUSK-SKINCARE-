const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./user");
const Product = require("./product");

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },

      quantity: {
        type: Number,
        default: 1,
      },
      price: {
        type: Number,
        default: 0,
      },
      name: {
        type: String,
      },
      images: [
        {
          url: String,
          filename: String,
        },
      ],
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
  modifiedOn: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
