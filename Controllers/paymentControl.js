const Product = require("../models/product");
const Cart = require("../models/cart");
const Address = require("../models/address");
const User = require("../models/user");
const Payment = require("../models/payment");
const Razorpay = require("razorpay");
const { v4: uuidv4 } = require("uuid");
const orderid = require("order-id")("key");

module.exports.billingForm = async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ userId }).populate("products");
  if (cart.products == []) {
    res.redirect("/");
  } else {
    let arr = [];
    for (var i = 0; i < cart.products.length; i++) {
      arr.push(cart.products[i].price);
    }
    let total = arr.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    res.render("Shop/billing", { total });
  }
};

module.exports.submitPayment = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId }).populate("products");
    let arr = [];
    for (var i = 0; i < cart.products.length; i++) {
      arr.push(cart.products[i].price);
    }
    let total = arr.reduce((prev, curr) => {
      return prev + curr;
    }, 0);

    const paymentDetail = await new Payment({
      userId,
      orderId: orderid.generate(),
      receiptId: uuidv4(),
      amount: total * 100,
      currency: "INR",
      createdAt: new Date(),
      status: "created",
    });
    await paymentDetail.save();
    // console.log("payment detail", paymentDetail);
    res.render("Shop/checkout", {
      title: "Confirm Order",
      paymentDetail,
      total,
    });
  } catch (err) {
    if (err) throw err;
  }
};

module.exports.verifyPayment = async (req, res) => {
  const userId = req.user._id;

  const paymentDetail = await Payment.findOne({ userId });

  const cart = await Cart.findOne({ userId }).populate("products");
  let arr = [];
  for (var i = 0; i < cart.products.length; i++) {
    arr.push(cart.products[i].price);
  }
  let total = arr.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
  res.render("Shop/cardDetails", { total, paymentDetail });
};

module.exports.orderSuccess = async (req, res) => {
  try {
    const userId = req.user._id;
    const payment = await Payment.findOne({ userId });
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { products: [] } }
    );
    await cart.save();
    res.render("Shop/paymentSuccess", { payment });
  } catch (e) {
    console.log(e);
    res.render("Shop/paymentFailure");
  }
};
