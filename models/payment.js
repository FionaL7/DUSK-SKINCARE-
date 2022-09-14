const mongoose = require("mongoose");
const User = require("./user");
const { Schema } = mongoose;

const paymentSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  orderId: {
    type: String,
    required: true,
  },
  receiptId: {
    type: String,
  },
  paymentId: {
    type: String,
  },

  amount: {
    type: Number,
  },
  currency: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  status: {
    type: String,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
