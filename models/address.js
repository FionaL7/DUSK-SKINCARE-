const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./user");

const addressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: String,
  street: String,
  city: String,
  state: String,
  zipcode: String,
  country: String,
  phone: String,
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
